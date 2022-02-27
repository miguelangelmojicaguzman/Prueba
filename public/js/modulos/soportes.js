import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-soporte');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e) =>{        
        const urlSoporte = e.target.dataset.soporteUrl;
        // console.log(urlProyecto);
    
        Swal.fire({
            title: '¿Está seguro de eliminar este soporte?',
            text: "Despues de eliminado no se podrá recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
        if (result.value) {
                //enviar petición a axios
                const url = `${location.origin}/soportes/${urlSoporte}`

                axios.delete(url, { params: { urlSoporte }})
                    .then(function(respuesta){
                        // console.log('respuesta');

                        Swal.fire(
                            'Soporte Elimiado.',
                            respuesta.data,
                            'success'
                        );

                        setTimeout(() => {
                            window.location.href = '/'                
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el soporte'
                        })

                    });
            }
        })
    });
};

export default btnEliminar;