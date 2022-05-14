document.addEventListener("DOMContentLoaded", async () => {
    //selecting all btn-delete-task 
    const deleteBtnsArr = document.querySelectorAll('.btn-delete-task')
    //iterate through each button
    deleteBtnsArr.forEach( btn => {
        btn.addEventListener('click', async(e) => {
            e.preventDefault()
            const taskId = e.target.id.split('-')[2]
            const res = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.message === 'Success') {
                const container = document.getElementById(`task-container-${taskId}`)
                container.remove()
            }
        })

})
    })