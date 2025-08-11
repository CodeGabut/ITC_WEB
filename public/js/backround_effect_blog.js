  const navEl = document.querySelector('.navbar') ; 
      const article1 = document.querySelector('.article1') ; 
      const article2 = document.querySelector('.article2') ; 
      const article3 = document.querySelector('.article3') ; 
      const article4 = document.querySelector('.article4') ; 

console.log("Tes ini adalah halaman : ");
console.log(window.SERVER_DATA.page);

if (window.SERVER_DATA.page == 1) {
  window.addEventListener('scroll' , ()=>{
        
        //NAVBAR
        if (window.scrollY >= 256) {
        
          navEl.classList.add('navbar_scrolled')
        } else if (window.scrollY < 256) {
          navEl.classList.remove('navbar_scrolled')
        }

        // ARTICLE 1 
        if (window.innerWidth < 768 && window.scrollY >= 700 ) {
          article1.classList.add("mobile_scroll_resize");
        } 
        if ( (window.scrollY >= 1158 || window.scrollY < 900  || window.innerWidth > 768)  ) {
          article1.classList.remove("mobile_scroll_resize");
          
        } 

        //ARTICLE 2
        if (window.scrollY >= 1158 && window.innerWidth < 768) {
          article2.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY >= 1700  || window.scrollY < 1158 || window.innerWidth > 768) {
          article2.classList.remove("mobile_scroll_resize");
        }

        //ARTICLE 3
        if (window.scrollY >= 1800 && window.innerWidth < 768) {
          article3.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY >= 2200  ||  window.scrollY <  1700|| window.innerWidth > 768) {
          article3.classList.remove("mobile_scroll_resize");
        }
        
        //ARTICLE 4 
        if (window.scrollY >= 2000 && window.innerWidth < 768) {
          article4.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY < 2200) {
          article4.classList.remove("mobile_scroll_resize");
        }
        

      })
}else {
  navEl.classList.add('navbar_scrolled')
  window.addEventListener('scroll' , ()=>{
      
      console.log(window.scrollY);
      

        // ARTICLE 1 
        if (window.innerWidth < 768 && window.scrollY >= 0 ) {
          article1.classList.add("mobile_scroll_resize");
        } 
        if ( (window.scrollY >= 200 || window.innerWidth > 768)  ) {
          article1.classList.remove("mobile_scroll_resize");
          
        } 

        //ARTICLE 2
        if (window.scrollY >= 220 && window.innerWidth < 768) {
          article2.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY >= 1000 || window.scrollY < 200 || window.innerWidth > 768) {
          article2.classList.remove("mobile_scroll_resize");
        }

        //ARTICLE 3
        if (window.scrollY >= 1000 && window.innerWidth < 768) {
          article3.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY >= 1300 ||  window.scrollY <  900|| window.innerWidth > 768) {
          article3.classList.remove("mobile_scroll_resize");
        }
        
        //ARTICLE 4 
        if (window.scrollY >= 1400 && window.innerWidth < 768) {
          article4.classList.add("mobile_scroll_resize");
        } 
        if (window.scrollY < 1300) {
          article4.classList.remove("mobile_scroll_resize");
        }
        

      })
}
    
      