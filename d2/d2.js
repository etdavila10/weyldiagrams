// The axes and grid lines should be drawn as soon as the webpage is rendered
const width = +d3.select('#result').style('width').slice(0,-2);
const height = +d3.select('#result').style('height').slice(0,-2);
const margin = { top: 30, bottom: 30, left: 30, right: 30 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const color_codes = {'red' : '1', 'blue': 's_1', 'green': 's_2', 'brown': 's_2s_1'};
const boundary = 20;
const marker_size = 7;

d3.select('#result').append('div')
    .attr('class', 'label')
    .style('top', '-20px')
    .style('left', '340px')
    .append('p')
        .text('$\\omega_2$');

d3.select('#result').append('div')
    .attr('class', 'label')
    .style('top', '310px')
    .style('left', '675px')
    .append('p')
        .text('$\\omega_1$');

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
const vals = range(-30, 30);

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

// line declaration for xAxis
const xAxis = d3.line()
    .x(d => xScale(d))
    .y(d => yScale(0));

// line declaration for yAxis
const yAxis = d3.line()
    .x(d => xScale(0))
    .y(d => yScale(d));

// make horizontal gridlines
for (i of vals) {
    const gridLine = d3.line()
        .x(d => xScale(d))
        .y(d => yScale(i));

    axesG.append('path')
        .datum(vals)
        .attr('fill', 'none')
        .attr('stroke', '#a3a3a3')
        .attr('stroke-width', 1.5)
        .attr('d', gridLine);
}

// make vertical gridlines
for (i of vals) {
    const gridLine = d3.line()
        .x(d => xScale(i))
        .y(d => yScale(d));

    axesG.append('path')
        .datum(vals)
        .attr('fill', 'none')
        .attr('stroke', '#a3a3a3')
        .attr('stroke-width', 1.5)
        .attr('d', gridLine);
}

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

    if (n % 2 == 0 && m % 2 == 0) {
        d3.selectAll('.scatter').remove();
        generate(n,m);
    } else {
        alert('Please make sure both "n" and "m" are even');
    }
});

function generate(n,m) {

    // PLOTTING Weyl Group element 1
    let xvals = [];
    let yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if ((2 * c1 - n)/2. >= 0 && (2 * c2 - m)/2. >= 0) {
                xvals.push(2 * c1);
                yvals.push(2 * c2);
            }
        }
    }

    let data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'red')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if ((-2 * c1 - n - 2)/2. >= 0 && (2 * c2 - m)/2. >= 0) {
                xvals.push(2 * c1);
                yvals.push(2 * c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'blue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if ((2 * c1 - n)/2. >= 0 && (-2 * c2 - m - 2)/2. >= 0) {
                xvals.push(2 * c1);
                yvals.push(2 * c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'green')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s2s1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if ((-2 * c1 - n - 2)/2. >= 0 && (-2 * c2 - m - 2)/2. >= 0) {
                xvals.push(2 * c1);
                yvals.push(2 * c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'brown')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

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
