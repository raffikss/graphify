//function for comparing 2 sets of coordinate distances between 2 points (green & red)
export function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
    }

    export function comparePoints(redPoints = [], greenPoints = [], tolerance = 0.05) {
    const matches = [];
    const usedGreen = new Set();

    for (let ri = 0; ri < redPoints.length; ri++) {
        const r = redPoints[ri];
        let bestDist = Infinity;
        let bestGi = -1;
        for (let gi = 0; gi < greenPoints.length; gi++) {
        if (usedGreen.has(gi)) continue;
        const g = greenPoints[gi];
        const d = distance(r, g);
        if (d <= tolerance && d < bestDist) {
            bestDist = d;
            bestGi = gi;
        }
        }
        if (bestGi !== -1) {
        matches.push({ redIdx: ri, greenIdx: bestGi, dist: bestDist });
        usedGreen.add(bestGi);
        }
    }

    const score = matches.length;
    return { score, matches };
    }
