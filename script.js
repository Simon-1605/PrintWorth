let trueCost;
let paymentFee;

const calculatorForm = document.querySelector("#calculator-form");
const profitabilityForm = document.querySelector("#profitability-form");
const profitabilityButton = document.querySelector("#check-profitability-button");

calculatorForm.addEventListener("input", function() {
    profitabilityButton.disabled = true;
});

calculatorForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Reading and converting input values to numbers
    const filamentUsed = Number(document.querySelector("#filament-used").value);

    const spoolPrice = Number(document.querySelector("#spool-price").value);

    const spoolWeight = Number(document.querySelector("#spool-weight").value);

    const hours = Number(document.querySelector("#print-time-hours").value);

    const minutes = Number(document.querySelector("#print-time-minutes").value);

    const powerInWatt = Number(document.querySelector("#printer-power").value);

    const electricityPrice = Number(document.querySelector("#electricity-price").value);

    const printerPrice = Number(document.querySelector("#printer-purchase-price").value);

    const printerLifespan = Number(document.querySelector("#expected-printer-lifetime").value);

    const preparationTimeInMinutes = Number(document.querySelector("#preparation-time-minutes").value);

    const postProcessingTimeInMinutes = Number(document.querySelector("#post-processing-time-minutes").value);

    const laborRate = Number(document.querySelector("#labor-rate").value);

    const otherCosts = Number(document.querySelector("#other-costs").value);

    const failureAllowance = Number(document.querySelector("#failure-allowance").value) / 100;

    paymentFee = Number(document.querySelector("#payment-fee").value) / 100;

    const profitMargin = Number(document.querySelector("#profit-margin").value) / 100; 


    // Calculations which need to be validated before proceeding
    const remainingShare = 1 - paymentFee - profitMargin;

    const values = [filamentUsed, spoolPrice, spoolWeight, hours, minutes, powerInWatt, electricityPrice, printerPrice, printerLifespan, preparationTimeInMinutes, postProcessingTimeInMinutes, laborRate, otherCosts];

    const percentageValues = [failureAllowance, paymentFee, profitMargin];

    const allNumericValues = [...values, ...percentageValues];
    

    // Validation

    //Checking for finite
    const hasNonFiniteValue = allNumericValues.some(function(value) {
        return !Number.isFinite(value);
    });
    if (hasNonFiniteValue) {
        alert("Please enter valid numeric values for all inputs.");
        return;
    }

    //Checking for negative values in the inputs
    const hasNegativeValue = values.some(function(value) {
        return value < 0;
    });
    if (hasNegativeValue) {
        alert("Please enter non-negative values for all inputs.");
        return;
    }

    //Checking for valid percentage values
    const hasInvalidPercentageValue = percentageValues.some(function(value) {
        return value < 0 || value > 1;
    });
    if (hasInvalidPercentageValue) {
        alert("Percentage values must be between 0% and 100%.");
        return;
    }

    // Validation for spool weight to avoid division by zero
    if (spoolWeight <= 0) {
        alert("Spool weight must be greater than zero.");
        return;
    }

    // Validation for printer lifespan to avoid division by zero
    if (printerLifespan <= 0) {
        alert("Expected printer lifetime must be greater than zero.");
        return;
    }

    // Validation for remaining share to avoid division by zero
    if (remainingShare <= 0) {
        alert("The sum of payment fee and profit margin must be less than 100%.");
        return;
    }

    // Validation for Minutes Input
    if (minutes < 0 || minutes >= 60) {
        alert("Please enter a valid number of minutes (0-59).");
        return;
    }



    // Calculations
    const materialCost = (filamentUsed / spoolWeight) * spoolPrice;
    const totalTimeInHours = hours + (minutes / 60);
    const powerInKilowatt = powerInWatt / 1000;
    const electricityCost = totalTimeInHours * powerInKilowatt * electricityPrice;
    const costPerPrintingHour = printerPrice / printerLifespan;
    const printerWear = totalTimeInHours * costPerPrintingHour;
    const totalLaborTimeInMinutes = preparationTimeInMinutes + postProcessingTimeInMinutes;
    const totalLaborTimeInHours = totalLaborTimeInMinutes / 60;
    const laborCost = totalLaborTimeInHours * laborRate;
    const baseCost = materialCost + electricityCost + printerWear + laborCost + otherCosts;
    const failureReserve = baseCost * failureAllowance;
    trueCost = baseCost + failureReserve;
    const sellingPrice = trueCost / remainingShare;


    // Outputs
    const materialCostOutput = document.querySelector("#total-material-cost");
    materialCostOutput.textContent = materialCost.toFixed(2);

    const electricityCostOutput = document.querySelector("#total-electricity-cost");
    electricityCostOutput.textContent = electricityCost.toFixed(2);

    const printerWearOutput = document.querySelector("#printer-wear");
    printerWearOutput.textContent = printerWear.toFixed(2);

    const laborCostOutput = document.querySelector("#total-labor-cost");
    laborCostOutput.textContent = laborCost.toFixed(2);

    const baseCostOutput = document.querySelector("#base-cost");
    baseCostOutput.textContent = baseCost.toFixed(2);

    const failureReserveOutput = document.querySelector("#failure-reserve");
    failureReserveOutput.textContent = failureReserve.toFixed(2);

    const trueCostOutput = document.querySelector("#true-cost");
    trueCostOutput.textContent = trueCost.toFixed(2);

    const sellingPriceOutput = document.querySelector("#selling-price");
    sellingPriceOutput.textContent = sellingPrice.toFixed(2);


    profitabilityButton.disabled = false;
});

profitabilityForm.addEventListener("submit", function(event) {
    event.preventDefault();


    // Reading the planned price input value and converting it to a number
    const plannedPriceInput = document.querySelector("#planned-price");
    const plannedPrice = Number(plannedPriceInput.value);

    const actualProfitElement = document.querySelector("#actual-profit");
    const actualMarginElement = document.querySelector("#actual-margin");


    // Validation
    if (plannedPrice <= 0) {
        alert("Please enter a planned price greater than zero.");
        return;
    }


    // Calculations
    const fees = paymentFee * plannedPrice;
    const actualProfit = plannedPrice - trueCost - fees;
    const actualMargin = actualProfit / plannedPrice;


    // creating classes for positive/negative results
    if (actualProfit < 0) {
        actualProfitElement.classList.add("negative-result");
        actualProfitElement.classList.remove("positive-result");
        actualMarginElement.classList.add("negative-result");
        actualMarginElement.classList.remove("positive-result");
    }  else {
        actualProfitElement.classList.add("positive-result");
        actualProfitElement.classList.remove("negative-result");
        actualMarginElement.classList.add("positive-result");
        actualMarginElement.classList.remove("negative-result");
    }


    // Outputs
    actualProfitElement.textContent = actualProfit.toFixed(2);
    actualMarginElement.textContent = (actualMargin * 100).toFixed(2);
});