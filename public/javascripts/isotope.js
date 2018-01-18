
$(document).ready(()=>{
    $('.map-form').submit(function(event){
        event.preventDefault()
    })
    var $grid = $('.grid').isotope({            
    });
    var stopBtn = $('#stopButtonLink');
    $('#mapNumber1').click(()=>{
        $grid.isotope({ filter: '.mapNumber1' })
        stopBtn.attr('href',stopBtn.attr('href')+'&map=1')
    });
    $('#mapNumber2').click(()=>{
        $grid.isotope({ filter: '.mapNumber2' })
        stopBtn.attr('href',stopBtn.attr('href')+'&map=2')
    }); 
    $('#mapNumber3').click(()=>{
        $grid.isotope({filter: '.mapNumber3'})
        stopBtn.attr('href',stopBtn.attr('href')+'&map=3')
    })
    $('#mapNumber4').click(()=>{
        $grid.isotope({filter: '.mapNumber4'})
        stopBtn.attr('href',stopBtn.attr('href')+'&map=4')
    })      
});
