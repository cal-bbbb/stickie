/*
AN ARRAY OF TASKS
We will organize our tasks in an array of objects.

Each task will feature a description, which will be displayed
in the list, and a category, which will control the background
color of the item in the list.

*/
let tasks = [
    { description: "go to the grocery store", category: "shopping" },
    { description: "do laundry", category: "household" },
    { description: "do Creative Coding homework", category: "work" }
];

/*
Here, we select the button we'll use to add tasks to the list.
Then, we bind a click event to that button so that every time
it is clicked, an update function is called.
*/

d3.select("#add-item").on("click", updateTaskList);





/*
Inside this function, we will do all the things necessary
to make the task list functional
*/
function updateTaskList() {

    // remove the current items
    d3.selectAll("li").remove();






    /*
    After we retrieve these things, we will add the data to our array
    of tasks by using the ARRAY.push() method.
    */

    let taskDesc = d3.select("#input-item").property("value");
    let taskCat = d3.select("#choose-category").property("value");

    let objPush = { description: taskDesc, category: taskCat };
    if (taskDesc != "") {
        tasks.push(objPush);
    }





    //DATA JOIN

    let li = d3.select("#task-list").selectAll("li")
        .data(tasks)
        .enter()
        .append("li")
        .attr("class", function(d) { return d.category; })
        .text(function(d) { return d.description; })
        .on("click", function() {
            d3.select(this).classed("completed", true);
        });



    let close = li.append("span")
        .attr("class", "close")
        .html("\u00D7");


    close.on("click", function(d) {

        let i = tasks.indexOf(d);
        tasks.splice(i, 1);
        d3.select(this.parentNode).remove();

    });



    d3.select("#input-item").property("value", "");
}

updateTaskList();