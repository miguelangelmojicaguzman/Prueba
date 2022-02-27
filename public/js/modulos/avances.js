import axios from "axios";
import Swal from 'sweetalert2';
import { actBarraAvance } from '../funciones/barraAvance';

const avances = document.querySelector('.listado-pendientes');

if(avances){
    avances.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idAvance = icono.parentElement.parentElement.dataset.avance;
            console.log(e.target);
            console.log(idAvance);
            // request hacia /avances/:id
            const url = `${location.origin}/avances/${idAvance}`;
            //console.log(url)

            axios.patch(url, { idAvance })
                .then(function(respuesta) {
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actBarraAvance();                       
                    }
                    
                })
        };

        if(e.target.classList.contains('fa-trash')){            
            const avanceHTML = e.target.parentElement.parentElement; //subimos 2 elementos en el html
            const idAvance = avanceHTML.dataset.avance;
            // const soporteUrl = avanceHTML.dataset.soporteurl;

            // console.log(avanceHTML);
            // console.log(idAvance);
            // console.log(soporteUrl);

            // return false;

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
                    // console.log('eliminando');
                    //enviar eleiminar por medio de axios

                    const url = `${location.origin}/avances/${idAvance}`;

                    axios.delete(url, { params: { idAvance }})
                    .then(function (respuesta) {
                        // console.log(respuesta); 
                        if (respuesta.status === 200){

                            // eliminamos el nodo del avance
                            const nodoEliminar = avanceHTML.parentElement;                            
                            nodoEliminar.removeChild(avanceHTML);

                            actBarraAvance();

                            // console.log(nodoEliminar.childElementCount);

                            // if(nodoEliminar.childElementCount === 0){ 
                            //     const parrafo = document.createElement('p');
                            //     const texto = document.createTextNode("Aún no hay avances para este soporte");
                            //     parrafo.appendChild(texto);
                            //     //console.log(nodoEliminar);
                            //     nodoEliminar.appendChild(parrafo);
                            // }; // otra forma es recargando la pagina cómo está mas abajo en el setTimeout

                            Swal.fire(
                                'Avance Elimiado.',
                                respuesta.data,
                                'success'
                            );
    
                            setTimeout(() => {
                                window.location.href = `${window.location}`;
                            }, 3000);                           

                        }                        
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el avance'
                        })

                    });
                }
            })

        };
    });
};

export default avances