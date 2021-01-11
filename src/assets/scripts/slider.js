/* eslint-disable */
import $ from '@/assets/scripts/jquery_cs';

let slider = {
  isDown: false,
  startX: 0,
  isMoving: false,
  scrollLeft: 0,
  $slider: null, //change to slider

  init() {
    this.$slider = $('.draggable');
    this.$slider.each((index , el) => {
      this.drag( $(el) );
    }); 
  },

  drag( element ) {
    element.mousedown((e) => { 
      this.isDown = true;
      element[0].classList.add('active');
      this.startX = e.pageX - element[0].offsetLeft;
      this.scrollLeft = element[0].scrollLeft;
    });
    element.mouseleave((e) => {
      this.isDown = false;
      element[0].classList.remove('active');
      setTimeout(()=> {
        this.isMoving = false;
      }, 300)
    });
    element.mouseup((e) => { 
      this.isDown = false;
      element[0].classList.remove('active');
      setTimeout(()=> {
        this.isMoving = false;
      }, 300)
    });
    element.mousemove((e) => { 
      if(!this.isDown) return;
      this.isMoving = true;
      e.preventDefault();
      const x = e.pageX - element[0].offsetLeft;
      const walk = (x - this.startX) * 1; //scroll-fast
      element[0].scrollLeft = this.scrollLeft - walk;
    });

    //prevent follow links when dragging
    element.find('a').click((e)=> {
      if(this.isMoving) {
        e.preventDefault();
      }
    });
  }

}


export default slider;
