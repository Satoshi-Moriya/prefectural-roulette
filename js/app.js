'use strict'
$(function() {

    // 市町村区を取得
    let city_names = [];

    $('#js-select-pref').on('change', function(){
        let js_start = $("#js-start");
        if (js_start.has('inactive')) {
            js_start.removeClass('inactive');
        }
        if (city_names.length !== 0) {
            city_names = [];
        }
        let send_data = {
            area : $("#js-select-pref").val()
        };
        $.ajax({
            url: 'https://www.land.mlit.go.jp/webland/api/CitySearch',
            dataType: 'json',
            data: send_data,
            success: function(response) {
                if (response.status == "OK") {                    
                    let data_array = response.data;
                    console.log(data_array.length)
                    $.each(data_array, function(index, val) {
                        city_names[index] = val.name;
                    });
                    console.log(city_names);
                } else {
                    console.log(response);
                }
                return false;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                return false;
            }
        });
        return false; 
    });


    // ランダムパネル
    let timeout_id = undefined;
    let stop_flag = false;
    const start = document.getElementById('js-start');
    const stop = document.getElementById('js-stop');
    const reset = document.getElementById('js-reset');

    class Panel {
        constructor() {

            this.p = document.createElement('p');
            this.p.textContent = '市町村区';
            this.p.classList.add('city-name');
    
            const section = document.querySelector('section');
            section.appendChild(this.p);
        }

        getRandomTextContent() {
            return city_names[Math.floor(Math.random() * city_names.length)];
        }

        spin(millisec) {
            this.p.textContent = this.getRandomTextContent();
            timeout_id = setTimeout(() => {
                if (!stop_flag) {
                    this.spin(10);
                } else {
                    millisec++;
                    this.spin(millisec);

                    if (millisec > 100) {
                        clearTimeout(timeout_id);
                        stop_flag = false;
                        start.classList.remove('inactive');
                        reset.classList.remove('inactive');
                    }
                }
            }, millisec);
        }
    }

    const panel = new Panel();

    start.addEventListener('click', () => {
        if (start.classList.contains('inactive')) {
            return;
        }
        start.classList.add('inactive');
        stop.classList.remove('inactive');
        reset.classList.add('inactive');
        panel.spin(10);
    });

    stop.addEventListener('click', () => {
        if (stop.classList.contains('inactive')) {
            return;
        }
        stop.classList.add('inactive');
        stop_flag = true;
    });

    reset.addEventListener('click', () => {
        if ($('#js-slot-panel p').text() != '市町村区') {
            $('#js-slot-panel p').text('市町村区');
            city_names = [];
            start.classList.add('inactive');
            stop.classList.add('inactive');
            console.log('reset');
        }
        return;
    });
});