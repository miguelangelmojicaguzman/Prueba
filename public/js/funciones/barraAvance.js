import Swal from 'sweetalert2';

export const actBarraAvance = () =>{
    const avances = document.querySelectorAll('li.tarea');
    // console.log(avances.length);

    if(avances.length){
        const avancesCompletos = document.querySelectorAll('i.completo');
        // console.log(avancesCompletos.length);

        const barra = Math.round((avancesCompletos.length / avances.length) * 100);
        // console.log(barra);

        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = barra + '%';

        if(barra === 100){
            Swal.fire(
                'Soporte Finalizado.',
                'Felicidades',
                'success'
            );
        };        

    }
    
};