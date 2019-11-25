import { Component } from '@angular/core';
import { BackendApiService } from 'src/services/backend-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * @property {number} selected Flag para saber cual form se mostrara
     */
    public selected: number;
    /**
     * @property {string} candidate Alcemana el valor de quien hace la prueba
     */
    public candidate: string;
    /**
     * @property {number[]} originalArray Lista de numeros original
     */
    public originalArray: number[];
    /**
     * @property {object[]} originalParagraph Lista de parrafos original
     */
    public originalParagraph: object[];
    /**
     * @property {number[]} singleArray Lista de numeros no repetidos
     */
    public singleArray: number[];
    /**
     * @property {object} repeatedValues Almacena el key con la cantidad de veces que se repite
     */
    public repeatedValues: object;
    /**
     * @property {string} dataFromInput Almacena los valores ordenados
     */
    public dataFromInput: string;
    /**
     * @property {boolean} loadSuccess Flag que indica que la data fue cargada correctamente
     */
    public loadSuccess: boolean;

    public response: { data?: any; error?: any; success: boolean;}

    constructor(
        private backendApiService: BackendApiService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService
    ) {
        this.selected = 0;
        this.candidate = 'Andres Flores';
    }

    /**
     * Metodo encargado de hacer la peticion
     * @param {number} path
     * @param {number} item 
     * @method selecteTask
     */
    selecteTask(item: number, path: string) {
        this.selected = item;
        this.spinner.show();
        this.backendApiService.getData(path).subscribe( (resp) => {
            this.handleResponse(resp);
        }, () => {
            this.toastr.error('Hubo un error');
        });
    }

    /**
     * Toggle para formatear la data necesario para la vista 1
     * @param {number[]} data
     * @method setData
     */
    setData(data: number[]) {
        this.repeatedValues = data.reduce((obj, char) => {
            obj[char] = (obj[char] || 0) + 1;
            return obj;
        }, {});

        this.singleArray = data.reduce((singleList, item) => {
            return singleList.includes(item) ? singleList : [...singleList, item ]
        }, []);
        this.dataFromInput = this.sortFunction(this.singleArray).join(', ');
    }

    /**
     * Metodo para ordenar lista de numeros
     * @param {number[]} data
     * @return {number[]}
     * @method setData
     */
    sortFunction(data: number[]) {
        let done = false;
        while (!done) {
            done = true;
            for (let i = 1; i < data.length; i += 1) {
                if (data[i - 1] > data[i]) {
                    done = false;
                    const tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        return data;
    }

    /**
     * Metodo para establecer que establece la cantidad de letras del parrafo de acuerdo al abecedario
     * @param {object} data
     * @return {number[]}
     * @method setTemplate
     */
    setTemplate(data: object) {
        const paragraph  = data['paragraph'];
        const str = paragraph.replace(/\s/g, '').toLowerCase().split('');
        const items = [];
        const alphabet = this.generateAlphabet();
        alphabet.forEach((char) => {
            const a = str.filter( item => item === char);
            items.push(a.length);
        });
        return items;
    }

    /**
     * Metodo que retonar el valor absoluto del numero ingresado
     * @param {object} number
     * @return {number}
     * @method setTotal
     */
    setTotal({ number }) {
        return Math.abs(number);
    }

    /**
     * Metodo que retonar un array con el abecedario
     * @return {string[]}
     * @method generateAlphabet
     */
    generateAlphabet() {
        return [...Array(26).keys()].map(i => String.fromCharCode(i + 97));
    }

    /**
     * Metodo para manejar la respuesta de la peticion
     * @return {response}
     * @method handleResponse
     */
    handleResponse(resp){
        setTimeout(()=> {
            this.spinner.hide();
        }, 1000)
        this.loadSuccess = !!resp.data;
        if (!this.loadSuccess) {
            this.toastr.error('Por favor intente de nuevo');
        }
        if (this.selected === 1) {
            if(resp.data) {
                this.originalArray = resp.data;
                this.setData(resp.data);
            }
        } else {
            if (resp.data) {
                this.originalParagraph = resp.data;
            }
        }
    }
}
