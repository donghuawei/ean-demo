$(function () {
    $("#checkIn").datepicker();
    $("#checkOut").datepicker();
});
var searchHotil = function () {
    var formData = $("#searchForm").serialize();
    var url = "http://api.ean.com/ean-services/rs/hotel/v3/list?apiExperience=PARTNER_WEBSITE&numberOfResults=20&cid=497259&apikey=363thtsppo32k6ek06c75jkn3e&sig=4ipf5b65h1t63&" + formData;
    $.ajax({
        url: "https://api.ean.com/ean-services/rs/hotel/v3/list?cid=497259&minorRev=30&apiKey=363thtsppo32k6ek06c75jkn3e&locale=en_US&currencyCode=USD&sig=8e80b94b8c2a3e804ed45c798de0b482&xml=%3CHotelListRequest%3E%0A%20%20%20%20%3Ccity%3ESeattle%3C%2Fcity%3E%0A%20%20%20%20%3CstateProvinceCode%3EWA%3C%2FstateProvinceCode%3E%0A%20%20%20%20%3CcountryCode%3EUS%3C%2FcountryCode%3E%0A%20%20%20%20%3CarrivalDate%3E1%2F16%2F2017%3C%2FarrivalDate%3E%0A%20%20%20%20%3CdepartureDate%3E1%2F18%2F2017%3C%2FdepartureDate%3E%0A%20%20%20%20%3CRoomGroup%3E%0A%20%20%20%20%20%20%20%20%3CRoom%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CnumberOfAdults%3E2%3C%2FnumberOfAdults%3E%0A%20%20%20%20%20%20%20%20%3C%2FRoom%3E%0A%20%20%20%20%3C%2FRoomGroup%3E%0A%20%20%20%20%3CnumberOfResults%3E25%3C%2FnumberOfResults%3E%0A%3C%2FHotelListRequest%3E",
        type: "GET",
        success: function (data) {
            debugger;
        }
    })
}

var getHotelList = function(){

    var destination = $('[name="destination"]').val();
    var adults = $('[name="adults"]').val();
    var occupancy = $('[name="occupancy"]').val();
    var locales = $('[name="locales"]').val();
    var currency = $('[name="currency"]').val();
    var minStar = $('[name="minStar"]').val();
    var maxStar = $('[name="maxStar"]').val();

    var checkIn = $('#checkIn').val()
    var checkOut = $('#checkOut').val()

    var params = {
        'destination': destination,
        'adults': adults,
        'occupancy': occupancy,
        'locales': locales,
        'currency': currency,
        'minStar': minStar,
        'maxStar': maxStar,
        'checkIn': checkIn,
        'checkOut': checkOut
    };
    $.post("/hotel-list", params, function(data){
        data = JSON.parse(data)
        if(data && data.requestUrl){
            $("#requestUrl").text(data.requestUrl)
        }
        if(data && data.result){
            var t = $('#hotel-list').DataTable();

            t.clear()

            var hotels = JSON.parse(data.result).HotelListResponse.HotelList.HotelSummary

            for(var i in hotels){

                var hotel = hotels[i]
                var roomDescription = hotel.RoomRateDetailsList.RoomRateDetails.roomDescription ? hotel.RoomRateDetailsList.RoomRateDetails.roomDescription: ""
                var hotelDescription = "";
                if(hotel.RoomRateDetailsList.RoomRateDetails.ValueAdds){
                    hotelDescription = hotel.RoomRateDetailsList.RoomRateDetails.ValueAdds.ValueAdd.description ? hotel.RoomRateDetailsList.RoomRateDetails.ValueAdds.ValueAdd.description: ""
                }

                t.row.add( [
                    '<img src="http://media.expedia.com' + hotel.thumbNailUrl + '" alt="" title="" width="70" height="70">',
                    hotel.name + '<br>' + roomDescription,
                    hotel.RoomRateDetailsList.RoomRateDetails.roomDescription + '<br>' + hotelDescription,
                    hotel.RoomRateDetailsList.RoomRateDetails.RateInfos.RateInfo.ChargeableRateInfo['@total'],
                    '<a href='+ hotel.deepLink+'>Link</a>',
                ] ).draw( false );
            }
        }
    })
}
