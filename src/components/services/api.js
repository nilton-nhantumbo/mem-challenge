class Api {
  constructor(AxiosApi) {
    this.AxiosApi = AxiosApi;
  }
  getRamMemoryRegions(url) {
    let self = this;
    let url = self.dataUrl;
    AxiosApi.get(url)
      .then(function (response) {
        let data = response.data;
        self.label = data.label;
        self.totalBytes = data.bytes;
        self.regions = data.regions;
      })
      .catch(function (error) {
        // handling error
        console.log(error);
      });
  }
}
