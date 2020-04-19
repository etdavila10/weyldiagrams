// The axes and grid lines should be drawn as soon as the webpage is rendered
const width = +d3.select('#result').style('width').slice(0,-2);
const height = +d3.select('#result').style('height').slice(0,-2);
const margin = { top: 10, bottom: 10, left: 10, right: 10 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const boundary = 20;
const marker_size = 10;

// making the svg element
const svg = d3.select('#result')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// where the entire plot will go
const g = svg.append('g');

// the range of values we want
const vals = range(-boundary, boundary);

// group that works with all the axes stuff
const axesG = g.append('g');

// This should be the right xscale
const xScale = d3.scaleLinear()
    .domain([-boundary, boundary])
    .range([margin.left, innerWidth + margin.left]);

// This should be the right yscale
const yScale = d3.scaleLinear()
    .domain([-boundary, boundary])
    .range([innerHeight + margin.bottom, margin.top]);

// This is where we get our n and m values from
$('#generate').click(function() {
    const n = $('input[name="n"]').val();
    const m = $('input[name="m"]').val();
    //if (n % 2 == 0 && m % 2 == 0) {
        //d3.selectAll('.scatter').remove();
        //generate(n,m);
    //} else {
        //alert('Please make sure both "n" and "m" are even');
    //}
});

function generate(n,m) {
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
