// The axes and grid lines should be drawn as soon as the webpage is rendered
const width = +d3.select('#result').style('width').slice(0,-2);
const height = +d3.select('#result').style('height').slice(0,-2);
const margin = { top: 30, bottom: 30, left: 30, right: 30 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const boundary = 16;
const marker_size = 7;

// Conversion from standard basis to omega basis
const omegaX = (x,y) => (Math.sqrt(2)/2.) * x + (Math.sqrt(2)/2. * y);
const omegaY = (x,y) => (Math.sqrt(2)/2.) * y;

// Initialize xvals and yvals
let xvals = [];
let yvals = [];

const color_codes = {
    'brown' : '1',
    'orange': 's_1',
    'yellow': 's_2',
    'maroon': 's_2s_1',
    'cyan': 's_1s_2',
    'gray': 's_1s_2s_1',
    'red': 's_2s_1s_2',
    'aquamarine': '(s_2s_1)^2',

    'crimson': '1, s_1',
    'pink': '1, s_2',
    'limegreen': 's_1, s_2s_1',
    'greenyellow': 's_2, s_1s_2',
    'blue': 's_2s_1, s_1s_2s_1',
    'fuchsia': 's_1s_2, s_2s_1s_2',
    'gold': 's_1s_2s_1, (s_2s_1)^2',
    'dodgerblue': 's_2s_1s_2, (s_2s_1)^2',

    'turquoise': '1, s_1, s_2s_1',
    'violet': '1, s_1, s_2',
    'green': 's_2, s_1s_2, s_2s_1s_2',
    'darkorange': 's_2, s_1s_2, s_2s_1s_2',
    'navy': 's_1s_2, s_2s_1s_2, (s_2s_1)^2',
    'mediumaquamarine': 's_2s_1s_2, (s_2s_1)^2, s_1s_2s_1',
    'mediumslateblue': '(s_2s_1)^2, s_1s_2s_1, s_2s_1',
    'orangered': 's_1, s_1s_2s_1, s_2'}

d3.select('#result').append('div')
    .attr('class', 'label')
    .style('top', '-20px')
    .style('left', '675px')
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

// line declaration for xAxis
const xAxis = d3.line()
    .x(d => xScale(omegaX(d,0)))
    .y(d => yScale(omegaY(d,0)));

// line declaration for yAxis
const yAxis = d3.line()
    .x(d => xScale(omegaX(0,d)))
    .y(d => yScale(omegaY(0,d)));

// make horizontal gridlines
for (i of vals) {
    const gridLine = d3.line()
        .x(d => xScale(omegaX(d, i)))
        .y(d => yScale(omegaY(d, i)));

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
        .x(d => xScale(omegaX(i, d)))
        .y(d => yScale(omegaY(i, d)));

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

    if (n % 2 == 0) {
        d3.selectAll('.scatter').remove();
        generate(n,m);
    } else {
        alert('Please make sure "n" is even');
    }
});

function generate(n,m) {
    // Inequality names based off paper
    const l1 = (x,y) => x + y - n - m;
    const l2 = (x,y) => (x - n)/2. + y - m;
    const l3 = (x,y) => y - n - m - 1.;
    const l4 = (x,y) => (x - n)/2. - m - 1;
    const l5 = (x,y) => (-x-n)/2. - m - 2;
    const l6 = (x,y) => -y - n - m - 3;
    const l7 = (x,y) => -x - y - n - m - 4;
    const l8 = (x,y) => (-x - n)/2. - y - m - 3;

    // PLOTTING Weyl Group element 1
    let xvals = [];
    let yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l2(2*c1, c2) >= 0
                && l3(2*c1, c2) < 0 && l4(2*c1, c2) < 0) {
                xvals.push(2 * c1);
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
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'brown')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l3(2*c1, c2) >= 0 && l2(2*c1, c2) >= 0
                && l1(2*c1, c2) < 0 && l5(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'orange')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l4(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l6(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .attr('stroke', 'gray')
            .style('fill', 'yellow')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_2s_1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l3(2*c1, c2) >= 0 && l5(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'maroon')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_1s_2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l6(2*c1, c2) >= 0 && l4(2*c1, c2) >= 0
                && l8(2*c1, c2) < 0 && l1(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'cyan')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_1s_2s_1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l7(2*c1, c2) >= 0 && l5(2*c1, c2) >= 0
                && l8(2*c1, c2) < 0 && l3(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'gray')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_2s_1s_2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l6(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l4(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'red')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s_2s_1s_2s_1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l7(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l5(2*c1, c2) < 0 && l6(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'aquamarine')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element one_s1
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l3(2*c1, c2) >= 0
                && l4(2*c1, c2) < 0 && l5(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'crimson')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element one_s2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l2(2*c1, c2) >= 0 && l4(2*c1, c2) >= 0
                && l3(2*c1, c2) < 0 && l6(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'pink')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s1, s21
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l2(2*c1, c2) >= 0 && l5(2*c1, c2) >= 0
                && l1(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'limegreen')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s2, s12
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l6(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l8(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'greenyellow')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s21, s121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l3(2*c1, c2) >= 0 && l7(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l8(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'blue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s12, s212
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l4(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l1(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'fuchsia')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s121, s2121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l5(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l6(2*c1, c2) < 0 && l3(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'gold')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s212, s2121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l6(2*c1, c2) >= 0 && l7(2*c1, c2) >= 0
                && l5(2*c1, c2) < 0 && l4(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'dodgerblue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element 1, s1, s21
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l3(2*c1, c2) >= 0 && l4(2*c1, c2) >= 0
                && l5(2*c1, c2) < 0 && l6(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'turquoise')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element 1, s1, s2
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l5(2*c1, c2) >= 0
                && l4(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'violet')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element 1, s2, s12
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l2(2*c1, c2) >= 0 && l6(2*c1, c2) >= 0
                && l3(2*c1, c2) < 0 && l8(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'green')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s2, s12, s212
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l7(2*c1, c2) >= 0 && l2(2*c1, c2) >= 0
                && l8(2*c1, c2) < 0 && l1(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'darkorange')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s12, s212, s2121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l1(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l7(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'navy')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s212, s2121, s121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l3(2*c1, c2) >= 0 && l8(2*c1, c2) >= 0
                && l2(2*c1, c2) < 0 && l6(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'mediumaquamarine')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s21, s121, s2121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l7(2*c1, c2) >= 0 && l4(2*c1, c2) >= 0
                && l5(2*c1, c2) < 0 && l1(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'mediumslateblue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    // PLOTTING Weyl Group element s1, s21, s121
    xvals = [];
    yvals = [];

    for (c1 of vals) {
        for (c2 of vals) {
            if (l6(2*c1, c2) >= 0 && l5(2*c1, c2) >= 0
                && l4(2*c1, c2) < 0 && l3(2*c1, c2) < 0) {
                xvals.push(2*c1);
                yvals.push(c2);
            }
        }
    }

    data = d3.zip(xvals, yvals);

    g.append('g')
        .selectAll('.scatter')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(omegaX(d[0], d[1])))
            .attr('cy', d => yScale(omegaY(d[0], d[1])))
            .attr('r', marker_size)
            .attr('class', 'scatter')
            .style('fill', 'orangered')
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
