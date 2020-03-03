const zoneSel = document.querySelector('#zoneSelId');
const defOption = document.querySelector('#defOption');
const spot = document.querySelector('.spot');
const hotZone = document.querySelector('.hot-zone');
const title = document.querySelector('.main-title');

//Ajax
const jsonUrl = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
let data = {};
fetch(jsonUrl, {method: 'get'})
    .then((response) => {
        return response.json();})
    .then ((jsonData) => {
        data = jsonData.result.records;
        selectAndHot(data);
});

//監聽
zoneSel.addEventListener('change', showSpot, false);
hotZone.addEventListener('click', showSpot, false);

// 整理行政區 - 計算各行政區景點計數，並按景點多到少排序
function spotCountSortFun(dataZone){
    // 各行政區景點計數
    let spotCount = {};
    dataZone.forEach(function(x){
        spotCount[x] = (spotCount[x] || 0) + 1;
    });

    //將物件轉為陣列 zoneSort
    let zoneSort = [];
    let spotCountValAry = Object.values(spotCount);
    let spotCountKeyAry = Object.keys(spotCount)
    for (let i=0; spotCountValAry.length > i; i++){
        let obj = {};
        obj.zone = spotCountKeyAry[i];
        obj.spotCount = spotCountValAry[i];
        zoneSort.push(obj);
    };

    //依景點數排序陣列
    zoneSort = zoneSort.sort(function(a,b){
        return a.spotCount < b.spotCount ? 1 : -1;
    });

    // 回傳 依景點數排序的行政區
    return zoneSort;
};

// 前四景點 印在熱門區域
function hotZoneFun(zoneSort){
    let hotStr = '';
    for (let i = 0; 4 > i; i++){
        switch (i){
            case 0:
                hotStr += `<li>
                    <a href="" class="categoryP">${zoneSort[i].zone}</a>
                </li>`;
            break;
            case 1:
                hotStr += `<li>
                    <a href="" class="categoryR">${zoneSort[i].zone}</a>
                </li>`;
            break;
            case 2:
                hotStr += `<li>
                    <a href="" class="categoryY">${zoneSort[i].zone}</a>
                </li>`;
            break;
            case 3:
                hotStr += `<li>
                    <a href="" class="categoryB">${zoneSort[i].zone}</a>
                </li>`;
            break;
        }
    };
    hotZone.innerHTML = hotStr;
};

// 選擇選單 或 點擊熱門行政區時 顯示html結果
function showResultFun(zone, data){
    const spotTotal = document.querySelector('.spot-total');
    let total = 0;
    let str = '';
    for (let i = 0; data.length > i ; i++){
        const dataZone = data[i].Zone;
        if ( zone === dataZone){
            title.textContent = zone;
            total += 1;
            str += `<li data-num="${i + 1}">
            <div class="spot-img" style="background-image: url(${data[i].Picture1});">
                <div class="spot-title">
                    <h3>${data[i].Name}</h3>
                    <p>${data[i].Zone}</p>
                </div>
            </div>
            <div class="spot-info">
                <ul class="info">
                    <li class="info-opentime">${data[i].Opentime}</li>
                    <li class="info-address">${data[i].Add}</li>
                    <li class="info-tel">${data[i].Tel}</li>
                </ul>
                <div class="info-ticket">
                    <img src="./images/icons_tag.png" alt="">
                    ${data[i].Ticketinfo}
                </div>
            </div>
        </li>`
        }
    }
    spot.innerHTML = str;
    spotTotal.innerHTML = `${total} 個景點`;
}

// select顯單、熱門行政區、預設資料
function selectAndHot(data){
    // 取json的所有行政區
    const dataZone = [];
    for (let i=0; data.length > i; i++ ){
        dataZone.push(data[i].Zone);
    };
    // 取前四景點 並印在熱門區域
    let zoneSort = spotCountSortFun(dataZone);
    hotZoneFun(zoneSort);

    // 產生 Select option 行政區
    for (let i = 0; zoneSort.length > i ; i++){
        const el = document.createElement('option');
        el.setAttribute('value', zoneSort[i].zone);
        el.innerHTML = zoneSort[i].zone;
        zoneSel.appendChild(el);
    }

    // 預設顯示景點最多行政區
    if ( spot.innerHTML === ''){
        showResultFun(zoneSort[0].zone, data);
        title.setAttribute('class', 'main-title ' + 'categoryP-text');
    }
}
//顯示景點
function showSpot(e){
    e.preventDefault();
    if (e.type === 'click'){
        if (e.target.nodeName !== 'A'){return;};
        let zone = e.target.text;
        
        // title 對應 button 顏色
        title.setAttribute('class', 'main-title ' + e.target.className + '-text');

        // 點擊熱門行政區 選單也跟著選取
        let opts = zoneSel.options;
        showResultFun(zone, data);

        for (let i=0; opts.length > 1; i++){
            if (e.target.text === opts[i].value){
                zoneSel.selectedIndex = i;
                break;
            }
        }
    } else if (e.type === 'change') {
        let zone = e.target.value;
        showResultFun(zone, data);
        title.setAttribute('class', 'main-title');
    }
}