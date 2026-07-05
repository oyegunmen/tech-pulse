![Header Image](img/social-preview.png)

Website - [www.indipulse.in](http://www.indipulse.in)

India Pulse cuts through noise, targetting the Indian defense and geopolitical space. It pulls data from News, Twitter, and YouTube RSS feeds, filters it by keywords, and presents it in a clean readable format without ads, and account.

## Working

The project is built on the [Flat Data](https://githubnext.com/projects/flat-data/) principle, officially supported by GitHub. A Python script runs hourly, scrapes RSS feeds, filters the content, and dumps everything into a flat `data.json` file. A static website then reads that file and renders it, that's it. Could it use SQLite? Yes. Does it need to? Probably not. A `data.json` file serves the purpose just fine, and that's enough, no need of over-engineering.

![Workflow Diagram](img/workflow.png)

## Customization

Swap out `feeds.json` with your own RSS sources and keywords, and you've got a custom feed for whatever you care about, agriculture, finance, tech, anything. You just need to find and plug in the right sources. 

## Local Setup

```bash
# Clone the repo
git clone https://github.com/oyegunmen/india-pulse.git
cd india-pulse

# Install dependencies
pip install -r requirements.txt

# Add your sources by editing feed.json file

# Run the aggregator
python aggregator.py

# Run the server
python -m http.server

# Open the browser and type
http://localhost:8000/
```

To change how often it updates, edit the schedule in the `.yml` workflow file. You can also spin up a Hetzner instance for $5/month and make the feed real-time.


## Thanks

This project uses [Nitter](https://github.com/zedeus/nitter), an open-source Twitter front-end that makes tweet aggregation possible. Thanks to its creator and everyone keeping it alive

Also, Thank you [@knadh](https://github.com/knadh) for providing this wonderful lightweight library, it made styling really easy.