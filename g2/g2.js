// The axes and grid lines should be drawn as soon as the webpage is rendered
const width = +d3.select('#result').style('width').slice(0,-2);
const height = +d3.select('#result').style('height').slice(0,-2);
const margin = { top: 30, bottom: 30, left: 30, right: 30 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const boundary = 16;
const marker_size = 7;

// Conversion from standard basis to alpha axis
const alphaX = (x,y) => x - (1.5 * y);
const alphaY = (x,y) => (Math.sqrt(3)/2.) * y;

// Initialize xvals and yvals
let xvals = [];
let yvals = [];

const color_codes = {
    'plum' : '1',
    'orange': 's_1',
    'yellow': 's_2',
    'maroon': 's_1s_2',

    'cyan': 's_2s_1',
    'gray': 's_1s_2s_1',
    'red': 's_2s_1s_2',
    'aquamarine': '(s_1s_2)^2',

    'cyan': '(s_1s_2)^2',
    'gray': 's_1(s_2s_1)^2',
    'red': 's_2(s_1s_2)^2',
    'aquamarine': '(s_2s_1)^3',
}

// Placing alpha_2 label
d3.select('#result').append('div')
    .attr('class', 'label')
    .style('top', '120px')
    .style('left', '2px')
    .append('p')
        .text('$\\alpha_2$');

// Placing alpha_1 label
d3.select('#result').append('div')
    .attr('class', 'label')
    .style('top', '310px')
    .style('left', '675px')
    .append('p')
        .text('$\\alpha_1$');

// making the svg element
const svg = d3.select('#result')
    .append('svg')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .style('border', '2px solid #c8c2b5')
    .attr('transform', `translate(${margin.left - 2}, ${margin.top - 2})`);

// where the entire plot will go
const g = svg.append('g');

// the range of values we want
const vals = range(-50, 50);

// group that works with all the axes stuff
const axesG = g.append('g');

// This should be the right xscale
const xScale = d3.scaleLinear()
    .domain([-boundary, boundary])
    .range([0, innerWidth]);

// This should be the right yscale
const yScale = d3.scaleLinear()
    .domain([-boundary, boundary])
    .range([innerHeight, 0]);

// make horizontal gridlines
for (i of vals) {
    const gridLine = d3.line()
        .x(d => xScale(alphaX(d, i)))
        .y(d => yScale(alphaY(d, i)));

    axesG.append('path')
        .datum(vals)
        .attr('fill', 'none')
        .attr('stroke', '#a3a3a370')
        .attr('stroke-width', 1.5)
        .attr('d', gridLine);
}

// make vertical gridlines
for (i of vals) {
    const gridLine = d3.line()
        .x(d => xScale(alphaX(i, d)))
        .y(d => yScale(alphaY(i, d)));

    axesG.append('path')
        .datum(vals)
        .attr('fill', 'none')
        .attr('stroke', '#a3a3a370')
        .attr('stroke-width', 1.5)
        .attr('d', gridLine);
}

// line declaration for xAxis
const xAxis = d3.line()
    .x(d => xScale(alphaX(d,0)))
    .y(d => yScale(alphaY(d,0)));

// line declaration for yAxis
const yAxis = d3.line()
    .x(d => xScale(alphaX(0,d)))
    .y(d => yScale(alphaY(0,d)));

// this will plot the x axis
axesG.append('path')
    .datum(vals)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 3)
    .attr('d', xAxis);

// this will plot the y axis
axesG.append('path')
    .datum(vals)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 3)
    .attr('d', yAxis);

// THIS CONCLUDES PLOTTING THE AXES AND GRID LINES

// This is where we get our n and m values from
$('#generate').click(function() {
    const n = $('input[name="n"]').val();
    const m = $('input[name="m"]').val();

    d3.selectAll('.scatter').remove();
    generate(n,m);
});

function generate(n,m) {
    // Inequality names based off paper
    const k1 = (x,y) => x - n;
    const k2 = (x,y) => y - m;
    const k3 = (x,y) => 3*y - x - n - 1;
    const k4 = (x,y) => x - y - m - 1;
    const k5 = (x,y) => 2*x - 3*y - n - 4;
    const k6 = (x,y) => 2*y - x - m - 2;
    const k7 = (x,y) => -x - n - 10;
    const k8 = (x,y) => -y - m - 6;
    const k9 = (x,y) => x - 3*y - n - 9;
    const k10 = (x,y) => y - x - m - 5;
    const k11 = (x,y) => 3*y - 2*x - n - 6;
    const k12 = (x,y) => x - 2*y - m - 4;


    const conditions = [
        [k1 , k2 , k3 , k4 ], [k3 , k2 , k6 , k1 ], [k1 , k4 , k2 , k5 ],
        [k5 , k4 , k12, k1 ], [k3 , k6 , k11, k2 ], [k11, k6 , k10, k3 ],
        [k5 , k12, k4 , k9 ], [k9 , k12, k8 , k5 ], [k11, k10, k6 , k7 ],
        [k7 , k10, k8 , k11], [k9 , k8 , k12, k7 ], [k7 , k8 , k10, k9 ],
        [k1 , k3 , k6 , k4 ], [k2 , k4 , k3 , k5 ], [k2 , k6 , k1 , k11],
        [k1 , k5 , k2 , k12], [k4 , k12, k1 , k9 ], [k3 , k11, k2 , k10],
        [k6 , k10, k3 , k7 ], [k5 , k9 , k4 , k8 ], [k12, k8 , k5 , k7 ],
        [k11, k7 , k6 , k8 ], [k10, k8 , k11, k9 ], [k9 , k7 , k12, k10],
        [k3 , k4 , k6 , k5 ], [k1 , k6 , k4 , k11], [k2 , k5 , k3 , k12],
        [k2 , k11, k10, k1 ], [k3 , k10, k2 , k7 ], [k7 , k6 , k8 , k3 ],
        [k11, k8 , k6 , k9 ], [k9 , k10, k12, k11], [k7 , k12, k10, k5 ],
        [k8 , k5 , k4 , k7 ], [k9 , k4 , k8 , k1 ], [k1 , k12, k9 , k2 ],
        [k3 , k5 , k6 , k12], [k4 , k6 , k5 , k11], [k1 , k11, k4 , k10],
        [k2 , k10, k1 , k7 ], [k3 , k7 , k2 , k8 ], [k8 , k6 , k9 , k3 ],
        [k11, k9 , k6 , k12], [k10, k12, k11, k5 ], [k7 , k5 , k10, k4 ],
        [k8 , k4 , k7 , k1 ], [k1 , k9 , k2 , k8 ], [k2 , k12, k3 , k9 ],
        [k6 , k5 , k11, k12], [k4 , k11, k10, k5 ], [k1 , k10, k4 , k7 ],
        [k2 , k7 , k1 , k8 ], [k3 , k8 , k2 , k9 ], [k6 , k9 , k3 , k12],
        [k11, k12, k6 , k5 ], [k10, k5 , k11, k4 ], [k4 , k7 , k10, k1 ],
        [k1 , k8 , k2 , k7 ], [k9 , k2 , k8 , k3 ], [k12, k3 , k6 , k9 ]
    ];
    const colors = [
        'brown', 'red', 'green',
        'aquamarine', 'blue', 'yellow',
        'purple', 'plum', 'maroon',
        'violet', 'orangered', 'gray',
        'navy', 'orange', 'olivedrab',
        'teal', 'navy', 'black',
        'brown', 'red', 'green',
        'aquamarine', 'blue', 'yellow',
        'purple', 'plum', 'maroon',
        'violet', 'orangered', 'gray',
        'navy', 'orange', 'olivedrab',
        'teal', 'navy', 'black',
        'brown', 'red', 'green',
        'aquamarine', 'blue', 'yellow',
        'purple', 'plum', 'maroon',
        'violet', 'orangered', 'gray',
        'navy', 'orange', 'olivedrab',
        'teal', 'navy', 'black',
        'brown', 'red', 'green',
        'aquamarine', 'blue', 'yellow'
    ];

    const conds_colors = conditions.map((ele, idx) => [ele, colors[idx]]);

    for (const [condition, color] of conds_colors) {
        plot_group(condition, color)
    }
}

function handleMouseOver(d, i) {
    const point = d3.select(this);
    const x = d[0];
    const y = d[1];
    const color = point.style('fill');

    point.attr('r', marker_size * 1.4);

    const dataInfo = d3.select('body').append('div')
        .attr('class', 'data-info')
        .attr('id', `t${x}${y}`)
        .style('left', (d3.event.pageX - 80) + 'px')
        .style('top', (d3.event.pageY - 150) + 'px');

    MathJax.typesetPromise().then(() => {
        dataInfo.append('p')
            .text(`$\\mathcal{A}(\\lambda, \\mu) = \\{${color_codes[color]}\\}$`);
        MathJax.typesetPromise();
    }).catch((err) => console.log(err.messge));

    MathJax.typesetPromise().then(() => {
        dataInfo.append('p')
            .text(`$c_1 = ${x}, c_2 = ${y}$`);
        MathJax.typesetPromise();
    }).catch((err) => console.log(err.messge));
}

function handleMouseOut(d, i) {
    const point = d3.select(this);
    const x = d[0];
    const y = d[1];

    point.attr('r', marker_size);

    d3.select(`#t${x}${y}`).remove();
}


// Method of making a range of numbers with a certain step in between
function range(start, end, step = 1) {
    const len = Math.floor((end-start) / step) + 1
    return Array(len).fill().map((_, idx) => start + (idx * step));
}

function plot_group(ineqs, color) {
    const condition = (c1, c2) => {
        return (ineqs[0](c1, c2) >= 0 && ineqs[1](c1, c2) >= 0
                && ineqs[2](c1, c2) < 0 && ineqs[3](c1, c2) < 0)
    }

    let xvals = [];
    let yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (condition(c1, c2)) {
                xvals.push(c1);
                yvals.push(c2);
            }
        }
    }

    let data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(alphaX(d[0], d[1])))
            .attr('cy', d => yScale(alphaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', color)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
}