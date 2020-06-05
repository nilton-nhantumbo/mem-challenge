class ApiService {
  constructor(axiosService) {
    this.axiosService = axiosService;
  }

  createGetRequest(url) {
    let self = this;
    var request = self.axiosService
      .get(url)
      .then((result) => result.data)
      .catch((error) => error);

    return request;
  }

  getRamRegions(url) {
    let self = this;
    var RamData = [];

    let ramRegionsRequest = self.createGetRequest(url);
    let ramDataTypesRequest = self.getRamRegionDataTypes();

    ramRegionsRequest.then((resultRamData) => {
      let fillRegionsRequests = self.fillRegions(resultRamData.regions);
      return fillRegionsRequests;
    });

    return Promise.all([ramDataTypesRequest, ramRegionsRequest]).then(
      (result) => {
        return (RamData = {dataTypes: result[0], data: result[1]});
      },
    );
  }

  getRamRegionDataTypes() {
    let self = this;
    let url =
      'https://gitlab.com/mem-challenge/json/-/raw/master/dataTypes.json';
    let request = self.createGetRequest(url);
    return request;
  }

  fillRegions(regions) {
    /// let blockRegions = regions.filter(({dataType}) => dataType == 'block');
    let self = this;
    if (regions && regions.length > 0) {
      regions.forEach((region) => {
        var request = self.createGetRequest(region.url);
        request.then((regionData) => {
          // console.log(x);
          region.data = regionData;
          if (region.data.regions) {
            let request2 = self.fillRegions(region.data.regions);
            return request2;
          }
        });
        return request;
      });
    }
  }
}

export default ApiService;
