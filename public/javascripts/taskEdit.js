
    //grabbing all the btn-edit-subtask buttons

console.log('SCRIPT FILE IS RUNNING')

const editBtnsArr = document.querySelectorAll('.btn-edit-task');

//iterate through an arr of buttons
editBtnsArr.forEach(btn => {
    btn.addEventListener('click', async(e) => {
        e.preventDefault();
        const taskId = e.target.id.split('-')[2];
        console.log(taskId, "THIS IS THE TASK ID IN EDIT------")

        const editForm = document.querySelector(`#edit-task-form-${taskId}`);
        editForm.classList.remove('hidden');

        // const res = await fetch(`/tasks/${taskId}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         content
        //     })
        // });
        // const data = await res.json()
        //     if (data.message === 'Success') {
        //         const contentEle = document.getElementById(`${taskId}-content`)
        //         console.log("CONTENT ELEMENT ",contentEle)
        //         contentEle.innerHTML = data.task.content
        //     } else {

        //     };
    });
});


const cancelBtnsArr = document.querySelectorAll('.btn-cancel-task');
console.log(cancelBtnsArr)
cancelBtnsArr.forEach(btn => {
    btn.addEventListener('click', async(e) => {
        e.preventDefault();
        const taskId = e.target.id.split('-')[3];
        console.log(taskId, "THIS IS THE TASK ID IN CANCEL------")
        const editForm = document.querySelector(`#edit-task-form-${taskId}`);
        console.log(editForm)
        editForm.classList.add('hidden');

        // const res = await fetch(`/tasks/${taskId}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         content
        //     })
        // });
        // const data = await res.json()
        //     if (data.message === 'Success') {
        //         const contentEle = document.getElementById(`${taskId}-content`)
        //         console.log("CONTENT ELEMENT ",contentEle)
        //         contentEle.innerHTML = data.task.content
        //     } else {

        //     };
    });
});
