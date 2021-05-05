# Filter-out dev dependencies for production builds
del(.devDependencies ["@vue/cli-plugin-e2e-cypress", "@vue/cli-plugin-unit-jest", "@types/jest"]) 
