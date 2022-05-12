function searchTask() {
  let input = document.getElementById('searchbar').value
  let tasks = document.getElementsByClassName('single-task');

  for (i = 0; i < tasks.length; i++) {
    if (!tasks[i].innerHTML.includes(input)) {
      tasks[i].style.display = "none";
    }
    else {
      tasks[i].style.display = "list-item";
    }
  }
}
