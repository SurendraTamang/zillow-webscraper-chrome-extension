async function scrollDown() {
    const wrapper = document.querySelector("#search-page-list-container");
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 600;
  
      var timer = setInterval(async () => {
        var scrollHeightBefore = wrapper.scrollHeight;
        wrapper.scrollBy(0, distance);
        totalHeight += distance;
  
        if (totalHeight >= scrollHeightBefore) {
          totalHeight = 0;
  
          // Calculate scrollHeight after waiting
          var scrollHeightAfter = wrapper.scrollHeight;
  
          if (scrollHeightAfter > scrollHeightBefore) {
            // More content loaded, keep scrolling
            return;
          } else {
            // No more content loaded, stop scrolling
            clearInterval(timer);
            resolve();
          }
        }
      }, 400);
    });
  }
  
  function getListings() {
    const listings = [];
  
    const lis = document.querySelectorAll("#search-page-list-container ul li");
    for (let i = 0; i < lis.length; i++) {
      const listing = lis[i];
      // if listing contains class ListItem, then it's a listing
      const classes = Array.from(listing.classList).join(" ");
      if (classes.includes("ListItem")) {
        // get the script tag
        const script = listing.querySelector("script");
        if (!script) {
          continue;
        }
  
        // find the ul who has a class that includes StyledPropertyCardHomeDetailsList
        const beds = listing
          ?.querySelector(
            'ul[class*="StyledPropertyCardHomeDetailsList"] li:nth-child(1)'
          )
          ?.textContent?.match(/\d+/)?.[0];
        const baths = listing
          ?.querySelector(
            'ul[class*="StyledPropertyCardHomeDetailsList"] li:nth-child(2)'
          )
          ?.textContent?.match(/\d+/)?.[0];
  
        // get the span with data-test=property-card-price
        const priceString = listing.querySelector(
          'span[data-test="property-card-price"]'
        )?.textContent;
  
        const price = Number(priceString.replace(/[^0-9.-]+/g, ""));
  
        const json = JSON.parse(script.textContent);
        listings.push({
          ...json.address,
          ...json.floorSize,
          ...json.geo,
          priceString: priceString,
          price,
          beds: beds ? Number(beds) : "",
          baths: baths ? Number(baths) : "",
          sqft: json?.floorSize?.value
            ? Number(json?.floorSize?.value.replace(/[^0-9.-]+/g, ""))
            : "",
          name: json.name,
          url: json.url,
        });
      }
    }
    return listings;
  }
  
  function createCSV(jsonData, fileName) {
    // Convert JSON to CSV
    const csvData = [];
  
    // Extract the headers
    const headers = Object.keys(jsonData[0]);
    csvData.push(headers.join(","));
  
    jsonData.forEach((item) => {
      const row = [];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (typeof item[key] === "number") {
            row.push(item[key]);
            continue;
          }
          const value = item[key]?.includes(",") ? `"${item[key]}"` : item[key];
          row.push(value);
        }
      }
      csvData.push(row.join(","));
    });
  
    // Create a Blob containing the CSV data
    const csvBlob = new Blob([csvData.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
  
    // Create a URL for the Blob
    const csvUrl = URL.createObjectURL(csvBlob);
  
    // Create a link element
    const link = document.createElement("a");
    link.href = csvUrl;
    link.target = "_blank";
    link.download = fileName;
  
    // Append the link to the body
    document.body.appendChild(link);
  
    // Trigger a click event on the link
    link.click();
  
    // Remove the link and revoke the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(csvUrl);
  }
  
  async function scrapeZillow() {
    let page = 1;
    const allListings = [];
  
    await scrollDown();
    const listings = getListings();
    console.log("listings", listings);
    allListings.push(...listings);
  
    // a title=Next page
    let nextButton = document.querySelector('a[title="Next page"]');
  
    // check aria-disabled
    let disabled = nextButton?.getAttribute("aria-disabled");
  
    if (nextButton && disabled !== "true") {
      nextButton.click();
    }
  
    while (nextButton && disabled !== "true") {
      console.log("page", page);
      await scrollDown();
      const listings = getListings();
     
      allListings.push(...listings);
      nextButton = document.querySelector('a[title="Next page"]');
      disabled = nextButton.getAttribute("aria-disabled");
      if (disabled === "true") {
        break;
      }
      nextButton.click();
      page++;
    }
  
    console.log(`Scraped ${allListings.length}`);
  
    createCSV(allListings, `zillowListings-${new Date().getTime()}.csv`);
  }

  (async () => {
    await scrapeZillow();
})();
