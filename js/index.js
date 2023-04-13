const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)

        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        }
        else {
            entry.target.classList.remove('show')
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {

    // Navigation toggle button
    document.querySelectorAll('.navigationToggle').forEach((navToggle) => {
        
        navToggle.addEventListener('click', () => {
            const navID = navToggle.getAttribute('aria-controls')
            const nav = document.querySelector(navID)
            const visibility = nav.getAttribute('data-visible')

            if (visibility === 'false') {
                nav.setAttribute('data-visible', true)
                navToggle.setAttribute('aria-expanded', true)
            }
            else if (visibility === 'true') {
                nav.setAttribute('data-visible', false)
                navToggle.setAttribute('aria-expanded', false)
            }
        })
    })

    // Scroll animation
    document.querySelectorAll('.hidden').forEach((ele) => observer.observe(ele))
})