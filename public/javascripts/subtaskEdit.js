//--------------------------------CLICK EDIT TO OPEN HIDDEN FORM--------------------

//selecting all the btn-edit-subtask buttons
const editBtnsArr = document.querySelectorAll('.btn-edit-subtask');
//iterate through an arr of buttons
editBtnsArr.forEach(btn => {
    //add eventlistener
    btn.addEventListener('click', async (e) => {
        //preventing default
        e.preventDefault();
        //split"edit-subtask-${subtask.id}" and select the subtask.id
        const subtaskId = e.target.id.split('-')[2];
        console.log("THIS IS THE subtask ID IN EDIT------", subtaskId)
        //select form div for this subtask
        const editForm = document.querySelector(`#edit-subtask-form-${subtaskId}`);
        //remove hidden class for this subtask
        editForm.classList.remove('hidden');
    });
});

//-----------------------------------Click CANCEL TO HIDE FORM----------------------

//selecting all the btn-cancel-subtask buttons
const cancelBtnsArr = document.querySelectorAll('.btn-cancel-subtask');
console.log(cancelBtnsArr)
//iterate through each cancel btn and add even listener
cancelBtnsArr.forEach(btn => {
    btn.addEventListener('click', async (e) => { //if not using await, might not need async
        e.preventDefault();
        //splitting cancel-subtask-form-${subtask.id}, and select the subtask id
        const subtaskId = e.target.id.split('-')[3];
        console.log(subtaskId, "THIS IS THE SUBTASK ID IN CANCEL------")
        //select form div for this subtask
        const editForm = document.querySelector(`#edit-subtask-form-${subtaskId}`);
        console.log(editForm)
        //add hidden class for this subtask
        editForm.classList.add('hidden');
    });
});

//--------------------------------CLICK SAVE TO EDIT FORM-------------------------
//selecting all the edit-subtask-form form
const editSubtaskFormsArr = document.querySelectorAll('.edit-subtask-form');
//iterate through each form btn and add even listener
editSubtaskFormsArr.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subtaskId = e.target.id.split('-')[3];

        const formData = new FormData(form);
        const content = formData.get('content');
        const taskId = formData.get('taskId');
        console.log("SUBTASK EDIT CONTENT", content)
        console.log("SUBTASK EDIT taskId", taskId)
        const res = await fetch(`/subtasks/${subtaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content,
                taskId
            })
        });

        const data = await res.json()
        if (data.message === 'Success') {
            const editForm = document.querySelector(`#edit-subtask-form-${subtaskId}`);
            console.log(editForm)
            editForm.classList.add('hidden');

            const contentEle = document.querySelector(`#content-${subtaskId}`)
            console.log("CONTENT ELEMENT ", contentEle)
            contentEle.innerHTML = content
        } else {
            console.log('THIS IS DATA WHEN WE HAVE ERRORS', data)

            const errorDiv = document.querySelector(`#subtask-error-container-${subtaskId}`)

            if (data.errors.tooLong) {
                errorDiv.innerHTML = `<p>${data.errors.tooLong}</p>`
            } else {
                errorDiv.innerHTML = `<p>${data.errors.tooShort}</p>`
            }
        };
    })
})
