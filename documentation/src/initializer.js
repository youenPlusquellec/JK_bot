window.onload = function() {
  
      //<editor-fold desc="Changeable Configuration Block">
      window.ui = SwaggerUIBundle({
        "dom_id": "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        queryConfigEnabled: true,
        validatorUrl: "https://validator.swagger.io/validator",
        url: "https://petstore.swagger.io/v2/swagger.json",
      })
      
      //</editor-fold>

};
