# Step 2 - MongoDB and Flask Application

# Scrape Web Data about Mars and collect all the scrape data

#Dependencies
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup


# Initialize browser
def init_browser():
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser

# Define scrape function
def scrape_mars():

    # Initialize browser
    browser = init_browser()

	# Dictionary to store all data to be scraped
    mars = {}
	
    #### NASA Mars News
    # URL to be scraped
    url_news = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
    browser.visit(url_news)
    # Scrape page into soup
    html = browser.html
    soup_news = BeautifulSoup(html, 'html.parser')
    # Scrape the Mars news title
    # news_title = soup_news.find_all('div', class_='content_title')[0].find('a').text.strip()
    news_title = soup_news.title.text
    # Scrape the Mars news text
    # news_text = soup_news.find_all('div', class_='rollover_description_inner')[0].text.strip()
    news_text = soup_news.body.p.text
    # Store data into dictionary
    mars['news_title'] = news_title
    mars['news_text'] = news_text


    ####JPL Mars Space Images - Featured Image
    # URL of page to be scraped, and visit the page using browser
    url_image = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url_image)
    # Assign html content, create a Beautiful Soup object
    html = browser.html
    soup_image = BeautifulSoup(html, 'html.parser')
    # Scrape path for the image
    href = soup_image.find_all('a', class_='fancybox')[0].get('data-fancybox-href').strip()
    featured_image_url = "https://www.jpl.nasa.gov"+href
    # Store data into dictionary
    mars['featured_image_url'] = 'test'


    #### Mars Weather
    # URL of page to be scraped, and visit the page using browser
    url_weather = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url_weather)
    # Assign html content, create a Beautiful Soup object
    html = browser.html
    soup_weather = BeautifulSoup(html, 'html.parser')
    # Scrap latest Mars weather tweet
    mars_weather = soup_weather.find_all('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text')[1].text
    # Store data into dictionary
    mars['weather'] = mars_weather


    ####  Mars Facts
    #URL of page to be scraped
    url_facts = 'https://space-facts.com/mars/' 
    # Use Pandas to get the url table
    tables = pd.read_html(url_facts)
    # Convert list of table into pandas dataframe
    df = tables[0]
    df.columns=['Items', 'value']
    # Set index to the df
    df.set_index('Items', inplace=True)
    # Use pandas to generate HTML tables
    facts = df.to_html('table.html')
    mars['mars_facts'] = facts

    #### Mars Hemispheres
    # URL of page to be scraped, and visit the page using browser
    url_hemi = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(url_hemi)
    # assign html content, create a Beautiful Soup object
    html = browser.html
    soup_hemi = BeautifulSoup(html, 'html.parser')
    # Find hemisphere image link and title
    mars_hemispheres = soup_hemi.find_all('div', class_='description')
    mars_hemispheres
    # List to store image urls
    hemisphere_image_urls = []
    # Loop through every hemispheres
    for image in mars_hemispheres:
        hemisphere_url = image.find('a', class_='itemLink')
        hemisphere = hemisphere_url.get('href')
        hemisphere_link = 'https://astrogeology.usgs.gov' + hemisphere
        print(hemisphere_link)
    
        # Visit each link that you just found (hemisphere_link)
        browser.visit(hemisphere_link)
    
        # Dictionary to hold title and image url
        hemisphere_image_dict = {}
    
        # Need to parse html again
        Hemispheres_html = browser.html
        mars_hemispheres_soup = BeautifulSoup(Hemispheres_html, 'html.parser')
    
        # Get image link
        hemisphere_link = mars_hemispheres_soup.find('a', text='Original').get('href')
    
        # Get title text
        hemisphere_title = mars_hemispheres_soup.find('h2', class_='title').text.replace(' Enhanced', '')
    
        # Append title and image urls of hemisphere to dictionary
        hemisphere_image_dict['title'] = hemisphere_title
        hemisphere_image_dict['img_url'] = hemisphere_link
    
        # Append dictionaries to list
        hemisphere_image_urls.append(hemisphere_image_dict)
        mars['hemisphere_image_urls'] = hemisphere_image_urls

    # Return results
    return mars
    
