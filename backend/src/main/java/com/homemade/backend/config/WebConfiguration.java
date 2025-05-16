package com.homemade.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Autoriser les requêtes sur cette route
                .allowedOrigins("http://localhost:3001") // Autoriser le frontend sur localhost:3000
                .allowedHeaders("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE");  // Autoriser les méthodes HTTP
    }
}
