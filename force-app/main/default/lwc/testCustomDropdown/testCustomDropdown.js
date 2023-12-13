import {
    LightningElement,
    track
} from 'lwc';

/**
 * @slot ok
 */
export default class TestCustomDropdown extends LightningElement {
    @track selectedLabel = 'Select Option';
    eventAttach = 0;
    cars = ['oka', 'mol', 'lsks'];

    constructor() {
        super();
        // Attach event listener to document in the constructor
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }


    renderedCallback() {
        if (this.eventAttach === 0) {
            this.template.addEventListener('click', function (event) {
                const target = event.target;
                if (
                    !target.classList.contains('options') &&
                    !target.classList.contains('drop-down-options') &&
                    !target.classList.contains('drop-down-btn') &&
                    !target.classList.contains('drp-label')
                ) {
                    if (event.target.querySelector(".drop-down-options").classList.contains("displaying")) {
                        event.target.querySelector(".drop-down-options").classList.remove("displaying");
                        let dropDownLabelElement = event.target.querySelector(".drp-label");
                        if (dropDownLabelElement.classList.contains('arrow-up')) {
                            dropDownLabelElement.classList.remove('arrow-up');
                            dropDownLabelElement.classList.add('arrow-down');
                        }
                    }
                }
            });
            this.eventAttach = 1;
        }
        var mainTarget = this.template.querySelector(".myslot");
        var subTarget = mainTarget.shadowRoot.querySelector(".slds-button_brand");
    }

    // add a global click event on document
    // handle open and close of dropdown when click of outside from the component and other part of whole document
    handleDocumentClick(event) {
        // Handle document click event here
        let currentTargetComponent = event.target;
        let dropDownElement = this.template.querySelector(".drop-down-options");
        let dropDownLabelElement = this.template.querySelector(".drp-label");

        // Check if the click event target is containe dropdown element as its children or not
        if (!currentTargetComponent.shadowRoot.querySelector('.drop-down-options')) {

            // Manipulate the class of the element
            dropDownElement.classList.remove('displaying');
            if (dropDownLabelElement.classList.contains('arrow-up')) {
                dropDownLabelElement.classList.remove('arrow-up');
                dropDownLabelElement.classList.add('arrow-down');
            }
        }
    }

    // handle open and close of the dropdown itself
    btnClickDrop(event) {
        this.template.querySelector(".drop-down-options").classList.toggle("displaying");
        let dropDownLabelElement = this.template.querySelector(".drp-label");
        if (dropDownLabelElement.classList.contains('arrow-up')) {
            dropDownLabelElement.classList.remove('arrow-up');
            dropDownLabelElement.classList.add('arrow-down');
        } else {
            dropDownLabelElement.classList.remove('arrow-down');
            dropDownLabelElement.classList.add('arrow-up');
        }
    }

    // handle open and close of the dropdown after choose the option
    handleOptions(event) {
        let dropDownLabelElement = this.template.querySelector(".drp-label");
        let allDropDownOptionsWrapper = this.template.querySelector(".drop-down-options");
        Array.from(this.template.querySelectorAll(".options")).forEach((ele) => {
            ele.classList.remove("selected");
        });
        event.target.classList.add("selected");

        this.selectedLabel = event.target.innerText;
        allDropDownOptionsWrapper.classList.toggle("displaying");
        if (dropDownLabelElement.classList.contains('arrow-up')) {
            dropDownLabelElement.classList.remove('arrow-up');
            dropDownLabelElement.classList.add('arrow-down');
        }
    }
}