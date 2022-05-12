window.addEventListener("load", (event)=>{
    console.log("hello from javascript!")

    const deleteBtns = document.querySelectorAll('.btn-delete-task')

    for (let i = 0; i < deleteBtns.length; i++) {
        const btn = deleteBtns[i];
        btn.addEventListener('click', async(e) => {
            e.preventDefault()
            const taskId = e.target.id.split('-')[2]
            const res = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            })

            const data = await res.json()
            if (data.message === 'Success') {
                const container = document.getElementById(`post-container-${taskId}`)
                container.remove()
            } else {

            }
        })
    }
})
