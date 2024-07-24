let now = new Date();

let notes = [{
        x: 100,
        y: 100,
        color: "salmon",
        title: "Card 1",
        list: [
            { comp: false, desc: "hello to the world", due: Date(now.getFullYear(), 11, 18) },
            { comp: false, desc: "This is item #2", due: Date(now.getFullYear(), 11, 19) },
            { comp: false, desc: "This is item #3", due: Date(now.getFullYear(), 11, 12) }
        ]
    },
    {
        x: 300,
        y: 200,
        color: "yellow",
        title: "Card 2",
        list: [
            { comp: false, desc: "this is list 2", due: Date(now.getFullYear(), 11, 18) },
            { comp: false, desc: "This is item #2", due: Date(now.getFullYear(), 11, 19) },
            { comp: false, desc: "This is item #3", due: Date(now.getFullYear(), 11, 12) }
        ]
    },
    {
        x: 600,
        y: 200,
        color: "yellow",
        title: "Card 3",
        list: [
            { comp: false, desc: "and a yellow card", due: Date(now.getFullYear(), 11, 18) },
            { comp: false, desc: "This is item #2", due: Date(now.getFullYear(), 11, 19) },
            { comp: false, desc: "This is item #3", due: Date(now.getFullYear(), 11, 12) }
        ]
    }
];

let colors = {
    yellow: "fecb86",
    salmon: "e56e91",
    purple: "c49ec9",
    green: "abd265",
    blue: "54c7e2",
    grey: "c6c6c5"
};

//set some css rules
let padding = 25;
let header = 150;
let headerHeight = 150 + padding;

let wrapperWidth = window.innerWidth - (padding * 2);
let wrapperHeight = window.innerHeight - headerHeight;

let svgWidth = wrapperWidth;
let svgHeight = wrapperHeight;

let stickysize = 250;

//for now
let lmarg = 0;




startup();






function startup() {
    //set header wrapper and canvas
    d3.select("#header")
        .style("height", `${header}px`);

    d3.select("#canvas-wrapper")
        .style("height", `${wrapperHeight}px`);

    //left margin for scale margin to value adjustment
    lmarg = (stickysize - 150) / 350 * 95;

    //put the scale label in
    d3.select("#scale-label")
        .style("margin-left", `calc(${lmarg}% - 10px)`)
        .text(stickysize);

    d3.select("#new-sticky")
        .style("margin-left", `calc(${lmarg}% - 10px)`)
        .on("click", newSticky);

    //size slider listener
    d3.select("#stickysizer")
        .on("input", function() {
            stickysize = d3.select("#stickysizer").property("value");

            d3.select("#canvas").selectAll("div")
                .style("transform", `scale(${stickysize/250})`);


            lmarg = (stickysize - 150) / 350 * 95;

            d3.select("#scale-label")
                .style("margin-left", `calc(${lmarg}% - 10px)`)
                .text(stickysize);

            drawWall();
        });

    drawWall();
}


function newSticky() {
    let ntitle = "Title here...";
    let ncolor = "grey";
    let nx = 50;
    let ny = 50;
    let nlist = [];

    let push = { x: nx, y: ny, color: ncolor, title: ntitle, list: nlist };
    notes.push(push);
    drawWall();

    console.log("new sticky created");
}


//update the wall
function drawWall() {

    d3.select("#canvas").select("svg").remove();

    d3.select("#canvas").selectAll("div").remove();

    let stickies = d3.select("#canvas")
        .selectAll("div")
        .data(notes)
        .enter()
        .append("div")
        .style("left", function(d) { return `${d.x}px`; })
        .style("top", function(d) { return `${d.y}px`; })
        .style("transform", `scale(${stickysize/250})`)
        .style("background", function(d) { return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path d='M243, 240C223, 253, 0, 250, 0, 250V0h250C250, 0, 253, 219, 243, 240z' fill='%23${colors[d.color]}'/></svg>") no-repeat`; })
        .attr("class", "sticky")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
            .filter(event => event.ctrlKey));
    //post-it shape made in Adobe Illustrator, & adapted to svg image background with a demonstration from https://codepen.io/netsi1964/pen/HGJms


    //drag functions -  adapted from examples at https://github.com/d3/d3-drag
    function dragstarted() {
        d3.select(this).raise();
        d3.select(this).classed("move-a", true);
    }

    function dragged(event, d) {

        d3.select(this)
            .style("left", (d.x = event.x) + 'px')
            .style("top", (d.y = event.y) + 'px');
    }

    function dragended() {
        d3.select(this).classed("move-a", false);
    }


    //title
    let titles = stickies.append("h4")
        .attr("contentEditable", true)
        .attr("class", "note-title")
        .attr("placeholder", "title here...")
        .text(function(d) { return d.title })
        .on("keyup", function(event, d) {
            d.title = d3.select(this).text();
        });


    //menu button
    let move = stickies.append("span")
        .attr("class", "move")
        .html("\u22EF");

    //close button
    let close = stickies.append("span")
        .attr("class", "close")
        .html("\u00D7");

    close.on("click", function(d) {
        let i = notes.indexOf(d);
        notes.splice(i, 1);
        d3.select(this.parentNode).remove();
    });



    //add the list to the sticky
    let listwrap = stickies.append("ul")
        .attr("class", "sticky-list");

    listwrap.selectAll("li").remove();

    //fill the list with li elements
    let lists = listwrap.selectAll("li")
        .data(function(d) { return d.list; })
        .enter()
        .append("li")
        .attr("class", "li-list-item");


    //add the checkbox
    let done = lists.insert("input")
        .attr("type", "checkbox")
        .attr("class", "done-button")
        .property("checked", function(d) { return d.comp; })
        .on("click", function(event, d) {

            if (d3.select(this).property("checked")) {
                console.log("checked");
                d.comp = true;
            } else {
                console.log("unchecked");
                d.comp = false;
            }

            drawWall();
        });


    //text item
    let items = lists.append("span")
        .attr("class", "list-item")
        .attr("contentEditable", true)
        .text(function(d) { return d.desc; })
        .on("keyup", function(event, d) {
            d.desc = d3.select(this).text();
        });

    //date icon
    let dates = lists.append("i")
        .data(function(d) { return d.list; })
        .attr("class", "fas fa-calendar-day date-icon")
        .attr("aria-hidden", "true")
        .style("display", function(d) {
            if (d.comp != true) {
                return "block";
            } else {
                return "none";
            }
        })
        .on("click", function(event, d) {
            datepicker(event, d);
        });




    //close item button
    let closeli = lists.append("span")
        .attr("class", "closeli")
        .style("display", function(d) {
            if (d.comp === true) {
                return "block";
            } else {
                return "none";
            }
        })
        .html("\u00D7")
        .on("click", function(event, d) {

            for (j = 0; j < notes.length; j++) {
                let i = notes[j].list.indexOf(d);
                if (i != -1) {
                    notes[j].list.splice(i, 1);
                    d3.select(this.parentNode).remove();
                }
            }

            drawWall();
        });



    //new item button
    let newitem = stickies.append("div")
        .attr("class", "add-button-wrapper text-center");

    let svgnew = newitem.append("svg")
        .attr("class", "add-button")
        .attr("width", 32)
        .attr("height", 32)
        .on("click", function(event, d) {
            let obj = { comp: false, desc: "", due: Date(now.getFullYear(), now.getMonth(), now.getDay()) };
            d.list.push(obj);
            drawWall();
        });

    let cir1 = svgnew.append("circle")
        .attr("cx", 16)
        .attr("cy", 16)
        .attr("r", 15)
        .attr("fill", "rgba(0,0,0,0)")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    let line1 = svgnew.append("line")
        .attr("x1", 16)
        .attr("y1", 5)
        .attr("x2", 16)
        .attr("y2", 27)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    let line2 = svgnew.append("line")
        .attr("x1", 5)
        .attr("y1", 16)
        .attr("x2", 27)
        .attr("y2", 16)
        .attr("stroke-width", 2)
        .attr("stroke", "black");



    //add the calendar card
    let calcard = d3.select("#canvas")
        .append("div")
        .attr("class", "cal-wrapper")
        .style("display", "none");

    calcard.append("input")
        .attr("type", "date")
        .attr("class", "date form-control");

    let closecal = calcard.append("span")
        .attr("class", "close-cal")
        .html("\u00D7");

    closecal.on("click", function() {
        d3.select(this.parentNode).style("display", "none");
    });

    //bring the calendar card to the front
    function datepicker(event, d) {

        calcard.raise()
            .style("display", "block")
            .style("left", `${event.x}px`)
            .style("top", `${event.y-175}px`);

        let q = 0;
        for (j = 0; j < notes.length; j++) {
            let i = notes[j].list.indexOf(d);
            if (i != -1) {
                notes[j].list.splice(i, 1);
                notes[j].list[i].due = calcard.property("value");
                q = notes[j].list[i].due;
            }
        }

        console.log(d);
        console.log(q);
        console.log("done");
    }

}

//resize the window if it gets changed
function resize() {
    let wrapperWidth = window.innerWidth - (padding * 2);
    let wrapperHeight = window.innerHeight - headerHeight;
    let svgWidth = wrapperWidth;
    let svgHeight = wrapperHeight;

    //change wrapper
    d3.select("#canvas-wrapper")
        .style("height", `${wrapperHeight}px`);

    drawWall();

    //make subtitle disappear
    if (window.innerWidth < 1024) {
        d3.select("#subtitle")
            .style("display", "none");
    } else {
        d3.select("#subtitle")
            .style("display", "inline");
    }
}
window.onresize = resize;