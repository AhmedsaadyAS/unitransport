// Schedule Management JavaScript
var scheduleManager = (function() {
    var editingTripId = null;

    return {
        showAddTripModal: function() {
            editingTripId = null;
            $('#tripModalTitle').text('Add Trip');
            $('#tripForm')[0].reset();
            this.loadVehicles();
            $('#tripModal').modal('show');
        },

        editTrip: function(tripId) {
            editingTripId = tripId;
            $('#tripModalTitle').text('Edit Trip');
            
            // Load trip details
            $.get(`/Admin/GetTrip/${tripId}`, function(response) {
                if (response.success) {
                    const trip = response.trip;
                    $('#vehicleId').val(trip.vehicleId);
                    $('#price').val(trip.price);
                    $('#departureLocation').val(trip.departureLocation);
                    $('#arrivalLocation').val(trip.arrivalLocation);
                    $('#departureTime').val(trip.departureTime.slice(0, 16));
                    $('#arrivalTime').val(trip.arrivalTime.slice(0, 16));
                    
                    scheduleManager.loadVehicles(trip.vehicleId);
                    $('#tripModal').modal('show');
                } else {
                    toastr.error(response.message || 'Error loading trip details');
                }
            });
        },

        loadVehicles: function(selectedVehicleId = null) {
            $.get('/Admin/GetActiveVehicles', function(response) {
                if (response.success) {
                    const select = $('#vehicleId');
                    select.empty();
                    select.append('<option value="">Select a vehicle</option>');
                    
                    response.vehicles.forEach(vehicle => {
                        const option = $('<option>')
                            .val(vehicle.vehicleId)
                            .text(`${vehicle.licensePlate} (${vehicle.vehicleType} - Capacity: ${vehicle.capacity})`);
                            
                        if (vehicle.vehicleId === selectedVehicleId) {
                            option.prop('selected', true);
                        }
                        
                        select.append(option);
                    });
                } else {
                    toastr.error('Error loading vehicles');
                }
            });
        },

        saveTrip: function() {
            const tripData = {
                tripId: editingTripId,
                vehicleId: $('#vehicleId').val(),
                price: parseFloat($('#price').val()),
                departureLocation: $('#departureLocation').val(),
                arrivalLocation: $('#arrivalLocation').val(),
                departureTime: $('#departureTime').val(),
                arrivalTime: $('#arrivalTime').val()
            };

            const formattedTripData = {
                TripId: tripData.tripId,
                VehicleID: tripData.vehicleId,
                Price: tripData.price,
                DepartureLocation: tripData.departureLocation,
                ArrivalLocation: tripData.arrivalLocation,
                DepartureTime: tripData.departureTime,
                ArrivalTime: tripData.arrivalTime
            };

            // Validation
            if (!this.validateTripData(tripData)) {
                return;
            }

            const url = editingTripId ? '/Admin/UpdateTrip' : '/Admin/AddTrip';
            
            $.ajax({
                url: url,
                type: 'POST',
                data: formattedTripData,
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                success: function(response) {
                    if (response.success) {
                        $('#tripModal').modal('hide');
                        toastr.success(response.message);
                        scheduleManager.refreshScheduleTable();
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function() {
                    toastr.error('An error occurred while saving the trip');
                }
            });
        },

        validateTripData: function(tripData) {
            if (!tripData.vehicleId) {
                toastr.error('Please select a vehicle');
                return false;
            }
            
            if (tripData.price <= 0) {
                toastr.error('Price must be greater than 0');
                return false;
            }
            
            if (!tripData.departureLocation || !tripData.arrivalLocation) {
                toastr.error('Please enter both departure and arrival locations');
                return false;
            }
            
            const departureTime = new Date(tripData.departureTime);
            const arrivalTime = new Date(tripData.arrivalTime);
            
            if (arrivalTime <= departureTime) {
                toastr.error('Arrival time must be after departure time');
                return false;
            }
            
            return true;
        },

        deleteTrip: function(tripId) {
            if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
                $.ajax({
                    url: '/Admin/DeleteTrip',
                    type: 'POST',
                    data: { tripId: tripId },
                    headers: {
                        'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            toastr.success(response.message);
                            scheduleManager.refreshScheduleTable();
                        } else {
                            toastr.error(response.message || 'Failed to delete trip');
                        }
                    },
                    error: function(xhr) {
                        toastr.error(xhr.responseJSON?.message || 'An error occurred while deleting the trip');
                    }
                });
            }
        },

        refreshScheduleTable: function() {
            $.get('/Admin/Schedules', function(html) {
                $('#scheduleTableContainer').html(html);
            });
        }
    };
})();

// Make scheduleManager globally available
window.scheduleManager = scheduleManager;

// Event Handlers
$(document).ready(function() {
    // Handle form submission
    $('#tripForm').on('submit', function(e) {
        e.preventDefault();
        scheduleManager.saveTrip();
    });
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
});
