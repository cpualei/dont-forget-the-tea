
//grabbing all the btn-edit-subtask buttons

console.log('SCRIPT FILE IS RUNNING')

const editBtnsArr = document.querySelectorAll('.btn-edit-task');

//iterate through an arr of buttons
editBtnsArr.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const taskId = e.target.id.split('-')[2];
        console.log(taskId, "THIS IS THE TASK ID IN EDIT------")

        const editForm = document.querySelector(`#edit-task-form-${taskId}`);
        editForm.classList.remove('hidden');
    });
});


const cancelBtnsArr = document.querySelectorAll('.btn-cancel-task');
console.log(cancelBtnsArr)
cancelBtnsArr.forEach(btn => {
    btn.addEventListener('click', async (e) => { //if not using await, might not need async
        e.preventDefault();
        const taskId = e.target.id.split('-')[3];
        console.log(taskId, "THIS IS THE TASK ID IN CANCEL------")
        const editForm = document.querySelector(`#edit-task-form-${taskId}`);
        console.log(editForm)
        editForm.classList.add('hidden');
    });
});


const editTaskFormsArr = document.querySelectorAll('.edit-task-form');

editTaskFormsArr.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = e.target.id.split('-')[3];

        const formData = new FormData(form);
        const content = formData.get('content')
        const dueDate = formData.get('dueDate')
        const listId = formData.get('listId')

        const res = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content,
                dueDate,
                listId
            })
        });

        const data = await res.json()
        if (data.message === 'Success') {
            const editForm = document.querySelector(`#edit-task-form-${taskId}`);
            console.log(editForm)
            editForm.classList.add('hidden');

            const contentEle = document.querySelector(`#content-${taskId}`)
            console.log("CONTENT ELEMENT ", contentEle)
            contentEle.innerHTML = content
        } else {
            console.log('THIS IS DATA WHEN WE HAVE ERRORS', data)

            const errorDiv = document.querySelector(`#task-error-container-${taskId}`)

            if (data.errors.tooLong) {
                errorDiv.innerHTML = `<p>${data.errors.tooLong}</p>`
            } else {
                errorDiv.innerHTML = `<p>${data.errors.tooShort}</p>`
            }
        };
    })
})
