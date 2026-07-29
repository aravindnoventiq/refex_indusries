const status = require("../helpers/response");
const { Footer, sequelize } = require("../models");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

module.exports = {
  get: asyncHandler(async (req, res) => {
    const footer = await Footer.findOne({ order: [["id", "DESC"]] });
    if (!footer) {
      return status.responseStatus(res, 200, "OK", null);
    }
    
    let footerData = footer.toJSON ? footer.toJSON() : footer;
    
    // Ensure backgroundImage is converted from background_image if needed
    if (footerData.backgroundImage === undefined && footerData.background_image !== undefined) {
      footerData.backgroundImage = footerData.background_image;
      delete footerData.background_image;
    }
    
    // Same for backgroundImageOpacity
    if (footerData.backgroundImageOpacity === undefined && footerData.background_image_opacity !== undefined) {
      footerData.backgroundImageOpacity = footerData.background_image_opacity;
      delete footerData.background_image_opacity;
    }
    
    return status.responseStatus(res, 200, "OK", footerData);
  }),
  upsert: asyncHandler(async (req, res) => {
    // Log incoming request
    console.log('=== Footer CMS Upsert Request ===');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body.backgroundImage:', req.body.backgroundImage);
    console.log('Request body.backgroundImage type:', typeof req.body.backgroundImage);
    console.log('Request body.backgroundImage === "":', req.body.backgroundImage === '');
    console.log('Request body.backgroundImage === null:', req.body.backgroundImage === null);
    console.log('Request body.backgroundImage === undefined:', req.body.backgroundImage === undefined);
    
    const payload = {
      sections: Array.isArray(req.body.sections) ? req.body.sections : [],
      socialLinks: Array.isArray(req.body.socialLinks) ? req.body.socialLinks : [],
      contactEmail: req.body.contactEmail || null,
      cin: req.body.cin || null,
      nseScripCode: req.body.nseScripCode || null,
      bseScripSymbol: req.body.bseScripSymbol || null,
      isin: req.body.isin || null,
      complaintsTitle: req.body.complaintsTitle || null,
      complaintsPhone: req.body.complaintsPhone || null,
      complaintsPhoneUrl: req.body.complaintsPhoneUrl || null,
      complaintsEmail: req.body.complaintsEmail || null,
      copyrightText: req.body.copyrightText || null,
      copyrightLink: req.body.copyrightLink || null,
      copyrightLinkText: req.body.copyrightLinkText || null,
      bottomLinks: Array.isArray(req.body.bottomLinks) ? req.body.bottomLinks : [],
      backgroundImage: req.body.backgroundImage !== undefined 
        ? (typeof req.body.backgroundImage === 'string' && req.body.backgroundImage.trim() ? req.body.backgroundImage.trim() : null)
        : undefined,
      backgroundImageOpacity: req.body.backgroundImageOpacity !== undefined ? parseFloat(req.body.backgroundImageOpacity) : 0.1,
      isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
    };
    
    // Log for debugging
    console.log('Footer CMS Save - payload.backgroundImage:', payload.backgroundImage);
    console.log('Footer CMS Save - payload.backgroundImageOpacity:', payload.backgroundImageOpacity);
    
    const existing = await Footer.findOne({ order: [["id", "DESC"]] });
    let saved;
    if (existing) {
      // Build update data explicitly, ensuring backgroundImage is always included
      // Process backgroundImage: empty string becomes null, otherwise use trimmed value
      let backgroundImageValue = null;
      
      console.log('=== Footer CMS - Processing backgroundImageValue ===');
      console.log('Footer CMS - req.body.backgroundImage:', req.body.backgroundImage);
      console.log('Footer CMS - req.body.backgroundImage type:', typeof req.body.backgroundImage);
      console.log('Footer CMS - req.body.backgroundImage !== undefined:', req.body.backgroundImage !== undefined);
      console.log('Footer CMS - req.body.backgroundImage !== null:', req.body.backgroundImage !== null);
      
      if (req.body.backgroundImage !== undefined && req.body.backgroundImage !== null) {
        console.log('Footer CMS - Processing non-null/undefined value');
        if (typeof req.body.backgroundImage === 'string') {
          const trimmed = req.body.backgroundImage.trim();
          console.log('Footer CMS - Trimmed value:', trimmed);
          console.log('Footer CMS - Trimmed length:', trimmed.length);
          if (trimmed.length > 0) {
            backgroundImageValue = trimmed;
            console.log('Footer CMS - Set backgroundImageValue to:', backgroundImageValue);
          } else {
            console.log('Footer CMS - Trimmed value is empty, keeping null');
          }
        } else {
          console.log('Footer CMS - Value is not a string, keeping null');
        }
        // If it's an empty string, backgroundImageValue remains null
      } else {
        // If not provided, keep existing value
        console.log('Footer CMS - Value not provided, using existing value');
        backgroundImageValue = existing.backgroundImage || existing.dataValues?.background_image || null;
        console.log('Footer CMS - Existing backgroundImageValue:', backgroundImageValue);
      }
      
      console.log('Footer CMS - Final backgroundImageValue:', backgroundImageValue);
      console.log('=== End Processing backgroundImageValue ===');
      
      const updateData = {
        sections: payload.sections,
        socialLinks: payload.socialLinks,
        contactEmail: payload.contactEmail,
        cin: payload.cin,
        nseScripCode: payload.nseScripCode,
        bseScripSymbol: payload.bseScripSymbol,
        isin: payload.isin,
        complaintsTitle: payload.complaintsTitle,
        complaintsPhone: payload.complaintsPhone,
        complaintsPhoneUrl: payload.complaintsPhoneUrl,
        complaintsEmail: payload.complaintsEmail,
        copyrightText: payload.copyrightText,
        copyrightLink: payload.copyrightLink,
        copyrightLinkText: payload.copyrightLinkText,
        bottomLinks: payload.bottomLinks,
        backgroundImage: backgroundImageValue, // Always explicitly set
        backgroundImageOpacity: payload.backgroundImageOpacity,
        isActive: payload.isActive,
      };
      
      console.log('Footer CMS Update - updateData.backgroundImage:', updateData.backgroundImage);
      console.log('Footer CMS Update - updateData keys:', Object.keys(updateData));
      console.log('Footer CMS Update - Existing ID:', existing.id);
      console.log('Footer CMS Update - Existing before update - background_image:', existing.dataValues.background_image);
      
      // Use direct SQL update to ensure background_image is saved correctly
      // This bypasses any Sequelize field mapping issues
      console.log('=== Footer CMS - SQL Update Section ===');
      console.log('Footer CMS - Executing direct SQL update for background_image...');
      console.log('Footer CMS - SQL Update - ID:', existing.id);
      console.log('Footer CMS - SQL Update - backgroundImageValue:', backgroundImageValue);
      console.log('Footer CMS - SQL Update - backgroundImageValue type:', typeof backgroundImageValue);
      console.log('Footer CMS - SQL Update - backgroundImageValue === null:', backgroundImageValue === null);
      console.log('Footer CMS - SQL Update - backgroundImageValue === undefined:', backgroundImageValue === undefined);
      console.log('Footer CMS - SQL Update - backgroundImageOpacity:', payload.backgroundImageOpacity);
      console.log('Footer CMS - SQL Update - backgroundImageOpacity type:', typeof payload.backgroundImageOpacity);
      
      // Build the SQL query with explicit logging
      const sqlQuery = 'UPDATE footer SET background_image = ?, background_image_opacity = ? WHERE id = ?';
      const sqlParams = [
        backgroundImageValue,
        payload.backgroundImageOpacity,
        existing.id
      ];
      
      console.log('Footer CMS - SQL Query:', sqlQuery);
      console.log('Footer CMS - SQL Params:', JSON.stringify(sqlParams));
      
      try {
        const [updateResult, metadata] = await sequelize.query(
          sqlQuery,
          {
            replacements: sqlParams,
            type: sequelize.QueryTypes.UPDATE
          }
        );
        console.log('Footer CMS - Direct SQL update result:', updateResult);
        console.log('Footer CMS - Update metadata:', metadata);
        console.log('Footer CMS - Rows affected (from result):', updateResult);
        
        // Immediately verify the update worked
        const [verifyResult] = await sequelize.query(
          'SELECT background_image, background_image_opacity FROM footer WHERE id = ?',
          { replacements: [existing.id], type: sequelize.QueryTypes.SELECT }
        );
        console.log('Footer CMS - Immediate verification after SQL update:', verifyResult);
        console.log('Footer CMS - Verified background_image:', verifyResult?.background_image);
        console.log('Footer CMS - Verified background_image_opacity:', verifyResult?.background_image_opacity);
        
        if (verifyResult && verifyResult.background_image !== backgroundImageValue) {
          console.error('Footer CMS - ERROR: SQL update did not save the value correctly!');
          console.error('Footer CMS - Expected:', backgroundImageValue);
          console.error('Footer CMS - Got:', verifyResult.background_image);
        } else {
          console.log('Footer CMS - SUCCESS: SQL update verified - value saved correctly');
        }
      } catch (sqlError) {
        console.error('Footer CMS - SQL Update Error:', sqlError.message);
        console.error('Footer CMS - SQL Error Stack:', sqlError.stack);
        throw sqlError;
      }
      
      // Also update other fields using Sequelize update
      const otherFields = { ...updateData };
      delete otherFields.backgroundImage;
      delete otherFields.backgroundImageOpacity;
      await existing.update(otherFields);
      console.log('Footer CMS - Other fields updated via Sequelize');
      
      // Reload with all attributes to ensure we get the latest data from database
      await existing.reload();
      
      console.log('Footer CMS - After reload - existing.dataValues.background_image:', existing.dataValues.background_image);
      console.log('Footer CMS - After reload - existing.backgroundImage:', existing.backgroundImage);
      
      // Verify the update by querying the database directly after reload
      let dbResult = null;
      try {
        [dbResult] = await sequelize.query(
          'SELECT background_image, background_image_opacity FROM footer WHERE id = ?',
          { replacements: [existing.id], type: sequelize.QueryTypes.SELECT }
        );
        console.log('Footer CMS - Direct DB query after reload:', dbResult);
        console.log('Footer CMS - DB background_image value:', dbResult?.background_image);
        console.log('Footer CMS - DB background_image_opacity value:', dbResult?.background_image_opacity);
        
        if (!dbResult || (dbResult.background_image !== backgroundImageValue && backgroundImageValue !== null)) {
          console.error('Footer CMS - WARNING: Database value does not match expected value!');
          console.error('Footer CMS - Expected:', backgroundImageValue);
          console.error('Footer CMS - Got from DB:', dbResult?.background_image);
          
          // Try one more time with direct SQL
          console.log('Footer CMS - Retrying SQL update...');
          await sequelize.query(
            'UPDATE footer SET background_image = ? WHERE id = ?',
            {
              replacements: [backgroundImageValue, existing.id],
              type: sequelize.QueryTypes.UPDATE
            }
          );
          await existing.reload();
          
          // Re-query after retry
          [dbResult] = await sequelize.query(
            'SELECT background_image, background_image_opacity FROM footer WHERE id = ?',
            { replacements: [existing.id], type: sequelize.QueryTypes.SELECT }
          );
          console.log('Footer CMS - Retry with direct SQL completed');
          console.log('Footer CMS - After retry DB background_image:', dbResult?.background_image);
        }
      } catch (queryError) {
        console.error('Footer CMS - Error querying database:', queryError.message);
        // Continue with null dbResult
      }
      
      // Store the database result for use in response building
      // This ensures we have the actual database values
      const verifiedBackgroundImage = dbResult?.background_image || backgroundImageValue || null;
      const verifiedBackgroundOpacity = dbResult?.background_image_opacity !== null && dbResult?.background_image_opacity !== undefined 
        ? parseFloat(dbResult.background_image_opacity) 
        : payload.backgroundImageOpacity;
      
      console.log('Footer CMS - Verified values for response:');
      console.log('Footer CMS - verifiedBackgroundImage:', verifiedBackgroundImage);
      console.log('Footer CMS - verifiedBackgroundOpacity:', verifiedBackgroundOpacity);
      
      // Manually set the backgroundImage and backgroundImageOpacity on the model instance
      // so they're included in the toJSON() response
      existing.setDataValue('backgroundImage', verifiedBackgroundImage);
      existing.setDataValue('backgroundImageOpacity', verifiedBackgroundOpacity);
      console.log('Footer CMS - Manually set backgroundImage on model:', existing.getDataValue('backgroundImage'));
      console.log('Footer CMS - Manually set backgroundImageOpacity on model:', existing.getDataValue('backgroundImageOpacity'));
      
      // Store verified values for use in final response
      existing._verifiedBackgroundImage = verifiedBackgroundImage;
      existing._verifiedBackgroundOpacity = verifiedBackgroundOpacity;
      
      saved = existing;
    } else {
      // For create, ensure backgroundImage is explicitly set
      const createData = {
        ...payload,
        backgroundImage: req.body.backgroundImage !== undefined 
          ? (typeof req.body.backgroundImage === 'string' && req.body.backgroundImage.trim() 
              ? req.body.backgroundImage.trim() 
              : null)
          : null,
      };
      
      console.log('Footer CMS - Create data.backgroundImage:', createData.backgroundImage);
      saved = await Footer.create(createData);
      console.log('Footer CMS - After create - saved.dataValues.background_image:', saved.dataValues.background_image);
    }
    
    // Get the latest values from database to ensure we have the correct data
    let finalDbResult = null;
    try {
      const finalQueryResult = await sequelize.query(
        'SELECT background_image, background_image_opacity FROM footer WHERE id = ?',
        { replacements: [saved.id], type: sequelize.QueryTypes.SELECT }
      );
      finalDbResult = finalQueryResult[0] || null; // Get first result from array
      console.log('Footer CMS - Final DB query result array:', finalQueryResult);
      console.log('Footer CMS - Final DB query result:', finalDbResult);
      console.log('Footer CMS - Final DB background_image:', finalDbResult?.background_image);
      console.log('Footer CMS - Final DB background_image_opacity:', finalDbResult?.background_image_opacity);
      console.log('Footer CMS - Final DB result is array:', Array.isArray(finalQueryResult));
      console.log('Footer CMS - Final DB result length:', finalQueryResult?.length);
    } catch (queryError) {
      console.error('Footer CMS - Error in final DB query:', queryError.message);
      console.error('Footer CMS - Query error stack:', queryError.stack);
    }
    
    // Convert to JSON - Sequelize should handle camelCase conversion
    let savedData = saved.toJSON ? saved.toJSON() : saved;
    
    console.log('Footer CMS - savedData before manual setting:', JSON.stringify(savedData, null, 2));
    console.log('Footer CMS - saved._verifiedBackgroundImage:', saved._verifiedBackgroundImage);
    console.log('Footer CMS - saved._verifiedBackgroundOpacity:', saved._verifiedBackgroundOpacity);
    
    // Manually ensure backgroundImage and backgroundImageOpacity are in the response
    // Priority: 1) _verifiedBackgroundImage (from update), 2) finalDbResult, 3) savedData.background_image, 4) saved.dataValues, 5) null/default
    if (saved._verifiedBackgroundImage !== undefined) {
      savedData.backgroundImage = saved._verifiedBackgroundImage;
      console.log('Footer CMS - Using _verifiedBackgroundImage:', savedData.backgroundImage);
    } else if (finalDbResult && finalDbResult.background_image !== null && finalDbResult.background_image !== undefined) {
      savedData.backgroundImage = finalDbResult.background_image;
      console.log('Footer CMS - Using finalDbResult.background_image:', savedData.backgroundImage);
    } else if (savedData.backgroundImage === undefined) {
      // Try to get from snake_case version
      if (savedData.background_image !== undefined) {
        savedData.backgroundImage = savedData.background_image;
        delete savedData.background_image; // Remove snake_case version
        console.log('Footer CMS - Using savedData.background_image:', savedData.backgroundImage);
      } else if (saved.dataValues && saved.dataValues.background_image !== undefined) {
        savedData.backgroundImage = saved.dataValues.background_image;
        console.log('Footer CMS - Using saved.dataValues.background_image:', savedData.backgroundImage);
      } else {
        savedData.backgroundImage = null;
        console.log('Footer CMS - Setting backgroundImage to null (default)');
      }
    }
    
    // Same for backgroundImageOpacity
    if (saved._verifiedBackgroundOpacity !== undefined) {
      savedData.backgroundImageOpacity = saved._verifiedBackgroundOpacity;
      console.log('Footer CMS - Using _verifiedBackgroundOpacity:', savedData.backgroundImageOpacity);
    } else if (finalDbResult && finalDbResult.background_image_opacity !== null && finalDbResult.background_image_opacity !== undefined) {
      savedData.backgroundImageOpacity = parseFloat(finalDbResult.background_image_opacity);
      console.log('Footer CMS - Using finalDbResult.background_image_opacity:', savedData.backgroundImageOpacity);
    } else if (savedData.backgroundImageOpacity === undefined) {
      if (savedData.background_image_opacity !== undefined) {
        savedData.backgroundImageOpacity = savedData.background_image_opacity;
        delete savedData.background_image_opacity;
        console.log('Footer CMS - Using savedData.background_image_opacity:', savedData.backgroundImageOpacity);
      } else if (saved.dataValues && saved.dataValues.background_image_opacity !== undefined) {
        savedData.backgroundImageOpacity = saved.dataValues.background_image_opacity;
        console.log('Footer CMS - Using saved.dataValues.background_image_opacity:', savedData.backgroundImageOpacity);
      } else {
        savedData.backgroundImageOpacity = 0.1;
        console.log('Footer CMS - Setting backgroundImageOpacity to 0.1 (default)');
      }
    }
    
    // Remove any snake_case versions to avoid confusion
    delete savedData.background_image;
    delete savedData.background_image_opacity;
    
    // FINAL CHECK: Explicitly ensure backgroundImage and backgroundImageOpacity are in the response
    // Get the most reliable source - directly from database
    let finalBackgroundImage = null;
    let finalBackgroundOpacity = 0.1;
    
    if (saved._verifiedBackgroundImage !== undefined) {
      finalBackgroundImage = saved._verifiedBackgroundImage;
    } else if (finalDbResult && finalDbResult.background_image !== null && finalDbResult.background_image !== undefined) {
      finalBackgroundImage = finalDbResult.background_image;
    } else if (saved.dataValues && saved.dataValues.background_image !== null && saved.dataValues.background_image !== undefined) {
      finalBackgroundImage = saved.dataValues.background_image;
    }
    
    if (saved._verifiedBackgroundOpacity !== undefined) {
      finalBackgroundOpacity = saved._verifiedBackgroundOpacity;
    } else if (finalDbResult && finalDbResult.background_image_opacity !== null && finalDbResult.background_image_opacity !== undefined) {
      finalBackgroundOpacity = parseFloat(finalDbResult.background_image_opacity);
    } else if (saved.dataValues && saved.dataValues.background_image_opacity !== null && saved.dataValues.background_image_opacity !== undefined) {
      finalBackgroundOpacity = parseFloat(saved.dataValues.background_image_opacity);
    }
    
    // FORCE these values into savedData - overwrite anything that might be there
    savedData.backgroundImage = finalBackgroundImage;
    savedData.backgroundImageOpacity = finalBackgroundOpacity;
    
    console.log('=== Footer CMS - Final Response Data ===');
    console.log('Footer CMS Saved - savedData keys:', Object.keys(savedData));
    console.log('Footer CMS Saved - savedData.backgroundImage (FINAL):', savedData.backgroundImage);
    console.log('Footer CMS Saved - savedData.backgroundImageOpacity (FINAL):', savedData.backgroundImageOpacity);
    console.log('Footer CMS Saved - savedData.backgroundImage type:', typeof savedData.backgroundImage);
    console.log('Footer CMS Saved - savedData.backgroundImage === null:', savedData.backgroundImage === null);
    console.log('Footer CMS Saved - savedData.backgroundImage === undefined:', savedData.backgroundImage === undefined);
    console.log('Footer CMS Saved - JSON.stringify(savedData):', JSON.stringify(savedData, null, 2));
    console.log('=== Footer CMS Upsert Complete ===');
    
    return status.responseStatus(res, 200, "Saved", savedData);
  }),
};

