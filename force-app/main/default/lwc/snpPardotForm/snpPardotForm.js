import { LightningElement,track } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/IMAGES';

export default class SnpPardotForm extends LightningElement {

@track imageUrl=IMAGES+'/bulb1.jpg';
}