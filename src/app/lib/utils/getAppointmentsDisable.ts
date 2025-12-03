import axios from 'axios';

export interface Days {
    lunes: number[];
    martes: number[];
    miercoles: number[];
    jueves: number[];
    viernes: number[];
    sabado: number[];
    domingo: number[];
}

interface ApiAvailability {
    message: string;
    availability: Days;
}

export async function getAppointmentsDisable(fixerId: string): Promise<Days> {
    try {
        const res = await axios.get<ApiAvailability>(
            'https://servineo-backend-lorem.onrender.com/api/crud_read/appointments/get_fixer_availability',
            {
                params: {
                    fixer_id: fixerId,
                },
            },
        );

        if (res.data && res.data.availability) {
            return res.data.availability;
        } else {
            console.log('No se encontró disponibilidad');
            return {
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: [],
            };
        }
    } catch (error) {
        console.error('Error desconocido:', error);

        return {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: [],
        };
    }
}
