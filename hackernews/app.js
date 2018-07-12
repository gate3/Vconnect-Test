(function (){
    'use strict';

    // General app object that holds constructor data
    var app = {
        axiosObject: axios.create({
            baseURL:'https://hacker-news.firebaseio.com/v0/',
        }),
        page:0,
        limit:10,
        currentItemsCount:10,
        parent:'main',
        mainLoader:document.getElementById('main-loader'),
        templateContainer: document.createElement('div'),
        dataStore:[]
    }

    // the template for each news item
    app.templateContainer.classList.add('media')

    //fetch the initial news items
    app.fetchNews = function () {
        app.axiosObject.get('topstories.json?print=pretty')
                       .then(handleSuccessData, handleError)

        //handle the success of the request
        function handleSuccessData (s) {
            if(s.status === 200){
                app.dataStore = s.data
                handleNewsItemsDisplay()
                hideMainLoader()
            }else{
                handleError(s)
            }
            //Pass the error to handleError so we have a common way of handling errors
        }

        // handle the error response
        function handleError (e) {
            alert('An error occurred')
            //we can log the error here and also display a message
        } 
    }

    //This function handles sorting the news items to show based on the current page
    function handleNewsItemsDisplay () {
        var news = app.dataStore.slice(app.page, app.currentItemsCount)
        var newsItems = news.map(prepareData)
        
        var parentNode = document.getElementById(app.parent)
        newsItems.forEach(function(i){
            parentNode.appendChild(i)
        })
        app.page += app.limit 
        app.currentItemsCount += app.limit
    }

    //prepare the data by placing it in a template
    function prepareData (data) {
        // this is the main template container, its just a div
        var templateCopy = app.templateContainer.cloneNode()
        var templateBody = document.createElement('div')
        templateBody.classList.add('media-body')

        // the template heading
        var heading = document.createElement('h4')
        heading.classList.add('media-heading')
        heading.textContent = `Some Title`

        // the text inside the template body itself
        var text = document.createElement('p')
        text.textContent = data

        templateBody.appendChild(heading)
        templateBody.appendChild(text)

        templateCopy.appendChild(templateBody)
        return templateCopy
    }

    // we handle the infinite scrolling here by watching when scroll event is at the bottom of the page
    document.onscroll = function() {
        if(document.documentElement.scrollTop + window.innerHeight == document.documentElement.scrollHeight)
        {
            handleNewsItemsDisplay()
        }
    }

    //after data has been fetched hide the loading text.
    function hideMainLoader () {
        app.mainLoader.style.visibility = 'hidden'
    }

    app.fetchNews()
})()