
document.addEventListener('DOMContentLoaded', () => {
    flatpickr('#date-picker', {
        enableTime: true, // Abilita la selezione dell'orario
        dateFormat: "d-m-Y H:i", // Formato della data (gg-mm-aaaa)
        altInput: true,     // Mostra un campo alternativo leggibile
        altFormat: "F j, Y H:i", // Formato leggibile nel campo alternativo
        defaultDate: new Date(), // Preimposta la data corrente
        minDate: new Date(),    // Impedisce di selezionare date passate
        time_24hr: true, // Usa il formato orario 24 ore
        locale: {
            firstDayOfWeek: 4 // La settimana inizia dal giovedì
        }
    });
});
