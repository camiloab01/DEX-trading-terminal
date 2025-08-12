FROM cr.gfx.cafe/open/swim/swim:v0.0.13
WORKDIR /dist
COPY dist/ .
CMD ["swim", "-port","3000","-fs","/dist","-name","oku-trade","-useSpaRouting","true","-pathPrefix","/app"]
