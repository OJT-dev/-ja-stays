package com.jastays.app;

import android.app.Application;
import com.bumptech.glide.Glide;
import com.bumptech.glide.GlideBuilder;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.load.engine.cache.InternalCacheDiskCacheFactory;
import com.bumptech.glide.load.engine.cache.LruResourceCache;
import com.bumptech.glide.module.AppGlideModule;
import com.bumptech.glide.request.RequestOptions;

public class MainApplication extends Application {
    private static final int MEMORY_CACHE_SIZE = 1024 * 1024 * 20; // 20MB
    private static final int DISK_CACHE_SIZE = 1024 * 1024 * 100;  // 100MB

    @Override
    public void onCreate() {
        super.onCreate();
        configureGlide();
    }

    private void configureGlide() {
        GlideBuilder builder = new GlideBuilder()
            .setMemoryCache(new LruResourceCache(MEMORY_CACHE_SIZE))
            .setDiskCache(new InternalCacheDiskCacheFactory(this, DISK_CACHE_SIZE))
            .setDefaultRequestOptions(
                new RequestOptions()
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .skipMemoryCache(false)
            );

        Glide.init(this, builder);
    }
}
