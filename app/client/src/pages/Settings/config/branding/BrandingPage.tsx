import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Previews from "./previews";
import SettingsForm from "./SettingsForm";
import { getTenantConfig } from "@appsmith/selectors/tenantSelectors";
import { Wrapper } from "@appsmith/pages/AdminSettings/config/authentication/AuthPage";

import { getAssetUrl } from "@appsmith/utils/airgapHelpers";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import { getUpgradeBanner } from "@appsmith/utils/BusinessFeatures/brandingPageHelpers";

export type brandColorsKeys =
  | "primary"
  | "background"
  | "font"
  | "hover"
  | "disabled";

export type Inputs = {
  brandColors: Record<brandColorsKeys, string>;
  APPSMITH_BRAND_LOGO: string;
  APPSMITH_BRAND_FAVICON: string;
};

type BrandingPageProps = {
  category: AdminConfigType;
};

function BrandingPage(props: BrandingPageProps) {
  const { category } = props;
  const isBrandingEnabled = category?.isFeatureEnabled ?? false;
  const tentantConfig = useSelector(getTenantConfig);
  const defaultValues = {
    brandColors: tentantConfig.brandColors,
    APPSMITH_BRAND_LOGO: tentantConfig.brandLogoUrl,
    APPSMITH_BRAND_FAVICON: tentantConfig.brandFaviconUrl,
  };
  const {
    control,
    formState,
    getValues,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<Inputs>({
    defaultValues,
  });

  const values = getValues();

  /**
   * reset the form when the tenant config changes
   */
  useEffect(() => {
    reset({
      brandColors: tentantConfig.brandColors,
      APPSMITH_BRAND_LOGO: tentantConfig.brandLogoUrl,
      APPSMITH_BRAND_FAVICON: tentantConfig.brandFaviconUrl,
    });
  }, [tentantConfig, reset]);

  watch();

  return (
    <Wrapper>
      {getUpgradeBanner(isBrandingEnabled)}
      <div className="grid md:grid-cols-[1fr] lg:grid-cols-[max(300px,30%)_1fr] gap-8 mt-4 pr-7">
        <SettingsForm
          control={control}
          defaultValues={defaultValues}
          disabled={!isBrandingEnabled}
          formState={formState}
          handleSubmit={handleSubmit}
          reset={reset}
          resetField={resetField}
          setValue={setValue}
          values={values}
        />
        <div className="flex-grow">
          <Previews
            favicon={getAssetUrl(values.APPSMITH_BRAND_FAVICON)}
            logo={getAssetUrl(values.APPSMITH_BRAND_LOGO)}
            shades={values.brandColors}
          />
        </div>
      </div>
    </Wrapper>
  );
}

export default BrandingPage;
