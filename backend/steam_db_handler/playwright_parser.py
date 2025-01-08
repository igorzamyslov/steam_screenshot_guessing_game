from typing import Set
from loguru import logger
from playwright.sync_api import sync_playwright

class PlaywriteParser:
    similar_app_ids: Set[int] = set()
    
    def __init__(self, app_id: int):
        self.app_id = app_id        
    
    def parse(self):
        with sync_playwright() as pw:
            # create browser instance
            browser = pw.chromium.launch(
                # we can choose either a Headful (With GUI) or Headless mode:
                headless=True,
            )
            # create context
            # using context we can define page properties like viewport dimensions
            context = browser.new_context(
                # most common desktop viewport is 1920x1080
                viewport={"width": 1920, "height": 1080}
            )
            # create page aka browser tab which we'll be using to do everything
            page = context.new_page()                        
            page.goto(f"https://store.steampowered.com/app/{self.app_id}")     
            
            # Check if the date selector is present on the page
            if page.query_selector('select#ageYear'):
                logger.debug("Got age restriction page")
                # Select the year 1990
                page.select_option('select#ageYear', '1990')
                # Click the view page button
                page.click('a#view_product_page_btn')
                
            if page.query_selector('select#ageYear'):
                logger.debug("Got age restriction page")
                # Select the year 1990
                page.select_option('select#ageYear', '1990')
                # Click the view page button
                page.click('a#view_product_page_btn')
    
            # Wait for the carousel to load
            page.wait_for_selector('.carousel__slider-tray a[href*="/app/"]')
            
            self.page = page
            self.similar_app_ids = self.get_similar_app_ids()
            logger.debug(f"Got Similar app IDs: {self.similar_app_ids}")
        return self    
        
    
    def get_similar_app_ids(self) -> Set[int]:
        # Extract all app links from the carousel            
        app_links = self.page.eval_on_selector_all(
            '.carousel__slider-tray a[href*="/app/"]',
            'elements => elements.map(el => el.href)'
        )
        # Convert app links to app id
        # Example: https://store.steampowered.com/app/243450/Urban_Trial_Freestyle?snr=1_5_9__18 to app_id 243450
        app_ids = [int(link.split('/')[-2]) for link in app_links]
        self.similar_app_ids.update(app_ids)
        return app_ids        
    

def main():
    app_id = 123456
    logger.info(f"Starting parser for app ID {app_id}")
    parser = PlaywriteParser(app_id)
    parser.parse()
    
    print(parser.similar_app_ids)    
    

if __name__ == "__main__":
    main()
