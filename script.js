class DisjointSet {
    constructor(size) {
        this.parent = new Array(size).fill(0).map((_, i) => i);
        this.rank = new Array(size).fill(0);
    }

    find(u) {
        if (this.parent[u] !== u) {
            this.parent[u] = this.find(this.parent[u]); // Path compression
        }
        return this.parent[u];
    }

    union(u, v) {
        const rootU = this.find(u);
        const rootV = this.find(v);

        if (rootU === rootV) return false; // Already connected

        // Union by rank
        if (this.rank[rootU] > this.rank[rootV]) {
            this.parent[rootV] = rootU;
        } else {
            this.parent[rootU] = rootV;
            if (this.rank[rootU] === this.rank[rootV]) {
                this.rank[rootV]++;
            }
        }
        return true;
    }
}

function calculateMST() {
    // Clear previous results
    const resultDiv = document.getElementById('result');
    const mstEdgesDiv = document.getElementById('mst-edges');
    const costSpan = document.getElementById('cost');
    mstEdgesDiv.innerHTML = '';
    resultDiv.classList.add('hidden');

    // Validate inputs
    const numCities = parseInt(document.getElementById('cities').value);
    const edgesInput = document.getElementById('edges').value.trim();

    if (isNaN(numCities) || numCities < 2) {
        alert("❌ Please enter a valid number of cities (≥ 2)");
        return;
    }

    if (!edgesInput) {
        alert("❌ Please enter road connections");
        return;
    }

    // Parse edges
    const edges = [];
    const edgeStrings = edgesInput.split(';').map(s => s.trim());

    for (const edgeStr of edgeStrings) {
        const parts = edgeStr.split(',').map(s => parseInt(s.trim()));

        if (parts.length !== 3 || parts.some(isNaN)) {
            alert(`❌ Invalid edge format: "${edgeStr}". Use "CityA,CityB,Cost"`);
            return;
        }

        let [u, v, cost] = parts;

        // Ensure valid city numbers
        if (u < 0 || v < 0 || u >= numCities || v >= numCities) {
            alert(`❌ City numbers must be between 0 and ${numCities - 1}`);
            return;
        }

        // Avoid duplicate edges and self-loops
        if (u === v) {
            alert(`❌ Invalid road: City ${u} cannot connect to itself.`);
            return;
        }

        edges.push({ u, v, cost });
    }

    console.log("Parsed edges:", edges); // Debugging

    // Run Kruskal's algorithm
    const sortedEdges = [...edges].sort((a, b) => a.cost - b.cost);
    const ds = new DisjointSet(numCities);
    const mst = [];
    let totalCost = 0;

    for (const edge of sortedEdges) {
        if (ds.union(edge.u, edge.v)) {
            mst.push(edge);
            totalCost += edge.cost;
            if (mst.length === numCities - 1) break; // MST complete
        }
    }

    // Check if we found a valid MST
    if (mst.length !== numCities - 1) {
        alert("❌ Error: Cities are not fully connectable with given roads");
        return;
    }

    // Display results
    mstEdgesDiv.innerHTML = mst.map(edge => `
        <div class="mst-edge">
            🛣 City ${edge.u} ↔ City ${edge.v} (Cost: ₹${edge.cost})
        </div>
    `).join('');

    costSpan.textContent = totalCost;
    resultDiv.classList.remove('hidden');

    // Visualization (Optional)
    drawRoadsOnMap(mst);
}

function drawRoadsOnMap(mstEdges) {
    console.log("🔍 Visualizing MST edges:", mstEdges);
    // Add visualization logic here if needed
}
