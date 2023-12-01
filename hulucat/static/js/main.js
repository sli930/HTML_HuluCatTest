/*
 * @Author: sam.shengle 
 * @Date: 2023-02-02 
 * @Last Modified by: sam.shengle
 * @Last Modified time: 2023-02-11 20:49:06
 */
window.onload = initialize;
var g_int_currentPage = 1;
var g_int_totalPage = 10;
var g_int_corrects = 0;
var g_bool_drinkExist = false;
var g_bool_dessertExist = false;
const s_int_maxToppingNum = 3;
var g_int_toppingNum = 0;
var g_szList_cartList = [];
var g_intList_recordingNumOrder = [];
var g_boolList_markDetailList = [];
var g_object_previousTarget = undefined;
var player;


function initialize(){
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    player = document.getElementById('player');
    for (i=0;i<g_int_totalPage;i++){
        g_boolList_markDetailList.push(null);
    }
    var randomNum = getRandomInt(answers.length);
    for (index = 0; index < answers.length; index++){
        while (g_intList_recordingNumOrder.includes(randomNum)){
            randomNum = getRandomInt(answers.length);
        }
        g_intList_recordingNumOrder.push(randomNum);
    }
    console.log(g_intList_recordingNumOrder);
    player.pause();
    player.setAttribute('src', `./static/record/record${g_intList_recordingNumOrder[g_int_currentPage-1]}.mp3`); 
    player.load();
    showPage();
}
function showRecordingNumOrder(){
    var headerDoc = document.getElementById('header-div');
    if (headerDoc.textContent=="HULUCAT LISTENING TEST"){
        headerDoc.textContent = g_intList_recordingNumOrder.toString();
    }else{
        headerDoc.textContent = "HULUCAT LISTENING TEST";
    }
}
function showPage(){
    function previousBtn(){
        if (1 < g_int_currentPage && g_int_currentPage <= g_int_totalPage){
            document.getElementById("previous-btn").style.color = "black";
        }else{
            document.getElementById("previous-btn").style.color = "grey";
        }
    }
    function nextBtn(){
        if (1 <= g_int_currentPage && g_int_currentPage < g_int_totalPage){
            document.getElementById("next-btn").style.color = "black";
        }else{
            document.getElementById("next-btn").style.color = "grey";
        }
    }
    if (g_boolList_markDetailList[g_int_currentPage-1] == true){
        document.getElementById('correct|incorrect').innerHTML = '✅';
    }else if (g_boolList_markDetailList[g_int_currentPage-1] == false){
        document.getElementById('correct|incorrect').innerHTML = '❌';
    }else{
        document.getElementById('correct|incorrect').innerHTML = '';
    }
    document.getElementById('check-btn').style.color = 'black';
    document.getElementById("current&total").textContent = g_int_currentPage + '/' + g_int_totalPage;
    previousBtn();nextBtn();
}
function previousBtn(){
    if (1 < g_int_currentPage && g_int_currentPage <= g_int_totalPage){
        g_int_currentPage -= 1;
        player.pause();
        player.setAttribute('src', `./static/record/record${g_intList_recordingNumOrder[g_int_currentPage-1]}.mp3`); 
        player.load();
        if (g_boolList_markDetailList[g_int_currentPage-1]==null){
            player.play();
        }
        showPage();
        emptySelect();
        cleanupCart();
    }
}
function nextBtn(){
    if (1 <= g_int_currentPage && g_int_currentPage < g_int_totalPage){
        g_int_currentPage += 1;
        player.pause();
        player.setAttribute('src', `./static/record/record${g_intList_recordingNumOrder[g_int_currentPage-1]}.mp3`); 
        player.load();
        if (g_boolList_markDetailList[g_int_currentPage-1]==null){
            player.play();
        }
        showPage();
        emptySelect();
        cleanupCart();
    }
}
function submitBtn(){
    function showMark(){
        g_int_corrects = g_boolList_markDetailList.filter(function(mark){
            return mark == true;
        }).length;
        alert("Your mark: "+g_int_corrects + "/" + g_int_totalPage+"\n" + "你的成績: "+g_int_corrects + "/" + g_int_totalPage);
    }
    var r = confirm("Are you sure to submit?\n是否確定提交?");
    if (r == true) {
        showMark();
    }
    emptySelect();

}
function checkBtn(){
    var index = g_int_currentPage-1;
    var selectedMenu = document.getElementById('selected_menu').textContent;
    if (g_szList_cartList.toString()==answers[g_intList_recordingNumOrder[index]].answer || selectedMenu ==answers[g_intList_recordingNumOrder[index]].answer){
        if (g_boolList_markDetailList[index]==null){
            document.getElementById('correct|incorrect').textContent = "✅"; 
            g_boolList_markDetailList[index] = true;
        }
        document.getElementById('check-btn').style.color = 'green';
    }else{
        if (g_boolList_markDetailList[index]==null){
            document.getElementById('correct|incorrect').textContent = "❌"; 
            g_boolList_markDetailList[index] = false;
        }
        document.getElementById('check-btn').style.color = 'red';
    }
}
function changeBlackColor(currentValue, index, arr){
    currentValue.style.color="black";
}
function changeDarkGreyColor(currentValue, index, arr){
    currentValue.style.color="darkgrey";
}
function getSubHeaderName(){
    currentSubHeader = event.currentTarget.parentElement.parentElement.parentElement;
    while (currentSubHeader.getElementsByClassName('sub_header-div').length == 0){
        currentSubHeader = currentSubHeader.parentElement;
    }
    currentSubHeader = currentSubHeader.getElementsByClassName('sub_header-div')[0];
    return currentSubHeader.getAttribute('name');
}
function select(){
    var currentTarget = event.currentTarget;
    var targetName = currentTarget.getAttribute('name');
    var targetColor = currentTarget.style.color;
    // 灰, unselected_drink
    if ('darkgrey' == targetColor){
        // 上个目标 黑 -> 灰
        g_object_previousTarget.style.color = 'darkgrey';
        if (g_object_previousTarget.getAttribute('name').toString().includes('drink')){
            g_object_previousTarget.setAttribute('name', 'unselected_drink');
            g_bool_drinkExist = !g_bool_drinkExist;
        }else if (g_object_previousTarget.getAttribute('name').toString().includes('dessert')){
            g_object_previousTarget.setAttribute('name', 'unselected_dessert');
            g_bool_dessertExist = !g_bool_dessertExist;
        }
        // 当前目标 灰 -> 黑
        currentTarget.style.color = 'black';
        if ('unselected_drink' == targetName){
            g_bool_drinkExist = true;
            currentTarget.setAttribute('name', 'selected_drink');
            // 配料
            document.getElementsByName('topping').forEach(changeBlackColor);
        }else if ('unselected_dessert' == targetName){
            g_bool_dessertExist = true;
            currentTarget.setAttribute('name', 'selected_dessert');
            // 配料
            document.getElementsByName('topping').forEach(changeDarkGreyColor);
        }
        // 其他所有目标 黑 -> 灰
        document.getElementsByName('unselected_drink').forEach(changeDarkGreyColor);
        document.getElementsByName('unselected_dessert').forEach(changeDarkGreyColor);
    }
    // 黑
    else{ 
        //未选
        if (targetName.includes('unselected')){
            // unselected_drink
            if (targetName.includes('drink')){
                g_bool_drinkExist = !g_bool_drinkExist;
                // 当前目标
                currentTarget.setAttribute('name', 'selected_drink');
            } 
            // unselected_dessert
            else if (targetName.includes('dessert')){
                g_bool_dessertExist = !g_bool_dessertExist;
                // 当前目标
                currentTarget.setAttribute('name', 'selected_dessert');
                // 配料
                document.getElementsByName('topping').forEach(changeDarkGreyColor);
            }
            // 其他所有目标 黑 -> 灰
            document.getElementsByName('unselected_drink').forEach(changeDarkGreyColor);
            document.getElementsByName('unselected_dessert').forEach(changeDarkGreyColor);
        }
        // 已选
        else if (targetName.includes('selected')){
            if (targetName.includes('drink')){
                g_bool_drinkExist = !g_bool_drinkExist;
                // 当前目标
                currentTarget.setAttribute('name', 'unselected_drink');
            }else if (targetName.includes('dessert')){
                g_bool_dessertExist = !g_bool_dessertExist;
                // 当前目标
                currentTarget.setAttribute('name', 'unselected_dessert');
                // 配料
                document.getElementsByName('topping').forEach(changeBlackColor);
            }
            // 其他所有目标 灰 -> 黑
            document.getElementsByName('unselected_drink').forEach(changeBlackColor);
            document.getElementsByName('unselected_dessert').forEach(changeBlackColor);
        }
    }
    g_int_toppingNum = 0;
    document.getElementById('selected_menu').textContent = currentTarget.getElementsByTagName('td')[0].innerText + ' ' + getSubHeaderName();
    g_object_previousTarget = currentTarget;
}
function selectTopping(){
    if (g_bool_drinkExist){
        if (g_bool_drinkExist && g_int_toppingNum < s_int_maxToppingNum){
            g_int_toppingNum += 1;
            var currentEventTarget = event.currentTarget;
            tdList = currentEventTarget.getElementsByTagName('td');
            document.getElementById('selected_menu').textContent += " + " + tdList[0].innerText;
        }
        if (g_int_toppingNum == s_int_maxToppingNum){
            document.getElementsByName('topping').forEach(changeDarkGreyColor);
        }
    }
}
function emptySelect(){
    g_int_toppingNum = 0;
    g_bool_drinkExist = false;
    g_bool_dessertExist= false;
    function changeUnselected(currentValue, index, arr){
        if (currentValue.getAttribute('name').includes('drink')){
            currentValue.setAttribute('name', 'unselected_drink');
        }else if (currentValue.getAttribute('name').includes('dessert')){
            currentValue.setAttribute('name', 'unselected_dessert');
        }
    }
    document.getElementsByName('selected_drink').forEach(changeUnselected);
    document.getElementsByName('selected_dessert').forEach(changeUnselected);
    document.getElementsByName("selected_drink").forEach(changeBlackColor);
    document.getElementsByName("selected_dessert").forEach(changeBlackColor);
    document.getElementsByName("unselected_drink").forEach(changeBlackColor);
    document.getElementsByName('unselected_dessert').forEach(changeBlackColor);
    
    document.getElementsByName('topping').forEach(changeBlackColor);
    document.getElementById('selected_menu').textContent = "";
}
function copy2Clipboard(){
    let transfer = document.createElement('input');
    document.body.appendChild(transfer);
    transfer.value = g_szList_cartList.toString();
    transfer.focus()
    transfer.select()
    if (document.execCommand('copy')) {
        transfer.blur()
    }
    document.body.removeChild(transfer)
}
function refreshCart(){
    var cart =  document.getElementById('cart-div');
    cart.innerHTML = "";
    g_szList_cartList.forEach(function(currentValue, index, arr){
        cart.innerHTML +=  '<b>'+ (index+1) + '</b>. ' + currentValue + '<br>';
    });
}
function add2Cart(){
    var selectedMenu = document.getElementById('selected_menu').textContent;
    if (selectedMenu != ""){
        sugerString = "";
        temperatureString = "";
        var sugarDoc = document.getElementById('sugar');
        if (sugarDoc.value != 'none'){
            sugerString = sugarDoc.value + " ";
        }
        var temperatureDoc = document.getElementById('temperature');
        if (temperatureDoc.value != 'none'){
            temperatureString = temperatureDoc.value + " ";
        }
        g_szList_cartList.push(sugerString+temperatureString+selectedMenu);
        refreshCart();
        emptySelect();
    }
}
function deleteLast(){
    g_szList_cartList.pop();
    refreshCart();
}
function cleanupCart(){
    g_szList_cartList = [];
    refreshCart();
}
function openFile(){
    var selectFile = document.getElementById('file').files[0];
    var reader = new FileReader();
    reader.readAsText(selectFile, 'UTF-8');
    reader.onload = function(){
        var fileStringList = this.result.split(/\r\n|\n/);
        console.log(fileStringList.toString());
        return fileStringList;
    }
    // var fileStringList;
    // var xmlhttp;
    // if (window.XMLHttpRequest){
    //     xmlhttp = new XMLHttpRequest();
    // }else{
    //     xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    // }
    // xmlhttp.onreadystatechange=callback;
    // xmlhttp.open('GET', './static/answer.txt', true);
    // xmlhttp.send();
    // function callback(){
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
    //         fileStringList = xmlhttp.responseText.split(/\r\n|\n/);
    //         console.log(fileStringList);
    //     }
    // }
}
