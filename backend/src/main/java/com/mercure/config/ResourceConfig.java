package com.mercure.config;

import com.mercure.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourceConfig implements WebMvcConfigurer {

    private Logger log = LoggerFactory.getLogger(ResourceConfig.class);

    @Autowired
    UserService userService;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods()
                .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:uploads/");
    }

//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//        log.info("addViewControllers");
//        if (userService.isProdProfile()) {
//            log.info("addViewControllers for INDEX.HTML");
////            registry.addViewController("/").setViewName("forward:index.html");
////            registry.addViewController("/").setViewName("redirect:index.html");
////            registry.addViewController("/").setViewName("forward:index.html");
//        }
//    }
}
