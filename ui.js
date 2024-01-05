const menuToggleButtons = document.querySelectorAll('.menu-button');
const menuToggleButton = menuToggleButtons[0];
const closeMenuButton = menuToggleButtons[1];

const sidebar = document.querySelector('.sidebar');
const rootContainer = document.querySelector('#root');
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');

const tagSearchContainer = document.querySelector('.tag-search-container');
const tagsScrollButton = tagSearchContainer.querySelector('button');

function openDrawerMenu() {
    if (window.innerWidth < 920) {
        sidebar.classList.add('small-screen');
        sidebar.querySelector('.top-logo-section').classList.remove('hide');
    }

    if (sidebar.classList.contains('small-screen')) {
        console.log('small-screen');
                
        sidebarBackdrop.classList.remove('hide');
    }
    sidebar.classList.add('expanded');
}

function closeDrawerMenu() {
    if (sidebar.classList.contains('small-screen')) {
        
        // sidebar.querySelector('.top-logo-section').classList.add('hide');
        sidebarBackdrop.classList.add('hide');
    }

    sidebar.classList.remove('expanded');
    
}

menuToggleButton.addEventListener('click', ()=> {
    if (sidebar.classList.contains('expanded')) {
        closeDrawerMenu();
    }
    else {
        openDrawerMenu();
    }
});
sidebarBackdrop.addEventListener('click', closeDrawerMenu);
closeMenuButton.addEventListener('click', closeDrawerMenu);


const accordionHeaderList = document.querySelectorAll('.accordion-header');

accordionHeaderList.forEach((accordionHeader)=> {
    
    accordionHeader.addEventListener('click', (event)=> {
        // if closed -> open
        const accordionHeader = event.target;
        const accordionTarget = event.target.previousElementSibling;

        if (accordionHeader.classList.contains('closed')) {
            
            accordionTarget.style.maxHeight = `${accordionTarget.scrollHeight}px`;
            accordionHeader.classList.remove('closed');
            accordionHeader.lastChild.textContent = 'Show Less';
        }
        else {
            accordionTarget.style.maxHeight = null;
            accordionHeader.classList.add('closed');
            accordionHeader.lastChild.textContent = 'Show More';
            
        }


    })
})


/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */
/*                             HTML ELEMENTS INTERACTION                 */

function updateThumbnailClickEvents() {
    const mainPageThumbnails = document.querySelectorAll('.thumbnail-container');

    mainPageThumbnails.forEach((thumbnailContainer) => {
        thumbnailContainer.addEventListener('click', (event) => {

            const videoId = thumbnailContainer.getAttribute('data-id');
            localStorage.setItem('targetVideoId', videoId);
        })
    })
}