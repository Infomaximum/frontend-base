class GlobalErrorModalService {
  private spinner = document.getElementById("spinner-wrapper");

  private internalErrorELement = document.getElementById("internal-error");

  public show() {
    if (this.spinner) {
      this.spinner.style.display = "none";
    }

    if (this.internalErrorELement) {
      window.isRejectionRequired = true;
      this.internalErrorELement.style.display = "block";
    }
  }
}

const globalErrorModalService = new GlobalErrorModalService();

export { globalErrorModalService as GlobalErrorModalService };
