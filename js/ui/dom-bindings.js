const landingView = document.querySelector("#landing-view");
const creationView = document.querySelector("#creation-view");
const identityStep = document.querySelector("#identity-step");
const speciesStep = document.querySelector("#species-step");
const classStep = document.querySelector("#class-step");
const originStep = document.querySelector("#origin-step");
const attributesStep = document.querySelector("#attributes-step");
const reviewStep = document.querySelector("#review-step");
const createButton = document.querySelector("#create-character");
const importButton = document.querySelector("#import-character");
const masterButton = document.querySelector("#master-access");
const creationBackButton = document.querySelector("#creation-back");
const creationNextButton = document.querySelector("#creation-next");
const reviewActions = document.querySelector("#review-actions");
const reviewSaveJsonButton = document.querySelector("#review-save-json");
const reviewOpenSheetButton = document.querySelector("#review-open-sheet");
const characterSheetScreen = document.querySelector("#character-sheet-screen");
const identityForm = document.querySelector("#identity-form");
const fileInput = document.querySelector("#json-file");
const fileStatus = document.querySelector("#file-status");
const masterStatus = document.querySelector("#master-status");

const characterNameInput = document.querySelector("#character-name");
const playerNameInput = document.querySelector("#player-name");
const campaignNameInput = document.querySelector("#campaign-name");
const gameMasterInput = document.querySelector("#game-master");
const characterNameError = document.querySelector("#character-name-error");
const playerNameError = document.querySelector("#player-name-error");
const campaignNameError = document.querySelector("#campaign-name-error");
const gameMasterError = document.querySelector("#game-master-error");

const portraitInput = document.querySelector("#portrait-input");
const choosePortraitButton = document.querySelector("#choose-portrait");
const removePortraitButton = document.querySelector("#remove-portrait");
const portraitPreview = document.querySelector("#portrait-preview");
const portraitEmpty = document.querySelector("#portrait-empty");
const portraitStatus = document.querySelector("#portrait-status");
const portraitCropDialog = document.querySelector("#portrait-crop-dialog");
const portraitCropCanvas = document.querySelector("#portrait-crop-canvas");
const portraitCropRange = document.querySelector("#portrait-crop-range");
const portraitCropZoomValue = document.querySelector("#portrait-crop-zoom-value");
const portraitCropStatus = document.querySelector("#portrait-crop-status");
const portraitCropCancel = document.querySelector("#portrait-crop-cancel");
const portraitCropApply = document.querySelector("#portrait-crop-apply");

const speciesList = document.querySelector("#species-list");
const speciesError = document.querySelector("#species-error");
const speciesVisual = document.querySelector("#species-visual");
const speciesCharacterArt = document.querySelector("#species-character-art");
const speciesSymbol = document.querySelector("#species-symbol");
const speciesSymbolName = document.querySelector("#species-symbol-name");
const speciesDetailsEmpty = document.querySelector("#species-details-empty");
const speciesDetailsContent = document.querySelector("#species-details-content");
const speciesDetailName = document.querySelector("#species-detail-name");
const speciesDetailSummary = document.querySelector("#species-detail-summary");
const speciesDetailDescription = document.querySelector("#species-detail-description");
const speciesDetailModifiers = document.querySelector("#species-detail-modifiers");
const speciesPhysicalBlock = document.querySelector("#species-physical-block");
const speciesDetailPhysical = document.querySelector("#species-detail-physical");
const speciesDetailAffinity = document.querySelector("#species-detail-affinity");
const speciesTraitBlock = document.querySelector("#species-trait-block");
const speciesDetailTraitName = document.querySelector("#species-detail-trait-name");
const speciesAbilityBlock = document.querySelector("#species-ability-block");
const speciesDetailAbilityName = document.querySelector("#species-detail-ability-name");
const speciesVulnerabilityBlock = document.querySelector("#species-vulnerability-block");
const speciesDetailVulnerabilityName = document.querySelector("#species-detail-vulnerability-name");
const speciesStyleBlock = document.querySelector("#species-style-block");
const speciesDetailStyle = document.querySelector("#species-detail-style");
const speciesOptions = document.querySelector("#species-options");

const classCategories = document.querySelector("#class-categories");
const classList = document.querySelector("#class-list");
const classPagePrevious = document.querySelector("#class-page-previous");
const classPageNext = document.querySelector("#class-page-next");
const classPageStatus = document.querySelector("#class-page-status");
const importClassButton = document.querySelector("#import-class");
const classJsonInput = document.querySelector("#class-json-input");
const classMessage = document.querySelector("#class-message");
const classSymbol = document.querySelector("#class-symbol");
const classSymbolName = document.querySelector("#class-symbol-name");
const classSymbolMechanic = document.querySelector("#class-symbol-mechanic");
const classDetailsEmpty = document.querySelector("#class-details-empty");
const classDetailsContent = document.querySelector("#class-details-content");
const classDetailCategory = document.querySelector("#class-detail-category");
const classDetailName = document.querySelector("#class-detail-name");
const classDetailSummary = document.querySelector("#class-detail-summary");
const classTabs = document.querySelector(".class-tabs");
const classTabPanel = document.querySelector("#class-tab-panel");
const classPanelTitle = document.querySelector("#class-panel-title");
const classPanelDescription = document.querySelector("#class-panel-description");
const classPanelList = document.querySelector("#class-panel-list");

const stageLabel = document.querySelector("#stage-label");
const stageHelper = document.querySelector("#stage-helper");
const stageProgress = document.querySelector(".stage-progress");
const stageProgressBar = document.querySelector("#stage-progress-bar");
const originForm = document.querySelector("#origin-form");
const originTitleInput = document.querySelector("#origin-title");
const originPlaceInput = document.querySelector("#origin-place");
const originStoryInput = document.querySelector("#origin-story");
const originStoryDialog = document.querySelector("#origin-story-dialog");
const originStoryOpen = document.querySelector("#origin-story-open");
const originStoryOpenLabel = document.querySelector("#origin-story-open-label");
const originStoryClose = document.querySelector("#origin-story-close");
const originStoryCancel = document.querySelector("#origin-story-cancel");
const originStorySave = document.querySelector("#origin-story-save");
const originStoryPreview = document.querySelector("#origin-story-preview");
const originStorySummaryCount = document.querySelector("#origin-story-summary-count");
const originStoryWordCount = document.querySelector("#origin-story-word-count");
const originTitleError = document.querySelector("#origin-title-error");
const originPlaceError = document.querySelector("#origin-place-error");
const originStoryError = document.querySelector("#origin-story-error");
const originStoryCounter = document.querySelector("#origin-story-counter");
const originPromptList = document.querySelector(".origin-prompt-list");
const attributesTabButton = document.querySelector("#attributes-tab-button");
const skillsTabButton = document.querySelector("#skills-tab-button");
const attributesPanel = document.querySelector("#attributes-panel");
const skillsPanel = document.querySelector("#skills-panel");
const attributesList = document.querySelector("#attributes-list");
const attributesAdjustmentMessage = document.querySelector("#attributes-adjustment-message");
const attributesPointsRemaining = document.querySelector("#attributes-points-remaining");
const attributesPointsTotal = document.querySelector("#attributes-points-total");
const attributesPointsUsed = document.querySelector("#attributes-points-used");
const attributesPointsBar = document.querySelector("#attributes-points-bar");
const attributesAffinityName = document.querySelector("#attributes-affinity-name");
const attributesAffinityLimit = document.querySelector("#attributes-affinity-limit");
const attributesFinalSummary = document.querySelector("#attributes-final-summary");
const attributesError = document.querySelector("#attributes-error");
const skillsList = document.querySelector("#skills-list");
const skillsPrevPage = document.querySelector("#skills-prev-page");
const skillsNextPage = document.querySelector("#skills-next-page");
const skillsPageLabel = document.querySelector("#skills-page-label");
const skillsMessage = document.querySelector("#skills-message");
const skillsTrainedCount = document.querySelector("#skills-trained-count");
const skillsTrainedLimit = document.querySelector("#skills-trained-limit");
const skillsAttributeSummary = document.querySelector("#skills-attribute-summary");
const reviewCharacterName = document.querySelector("#review-character-name");
const reviewSpeciesName = document.querySelector("#review-species-name");
const reviewClassName = document.querySelector("#review-class-name");
const reviewOriginTitle = document.querySelector("#review-origin-title");
const reviewFinalForca = document.querySelector("#review-final-forca");
const reviewFinalAgilidade = document.querySelector("#review-final-agilidade");
const reviewFinalIntelecto = document.querySelector("#review-final-intelecto");
const reviewFinalResistencia = document.querySelector("#review-final-resistencia");
const reviewTrainedSkills = document.querySelector("#review-trained-skills");
const reviewSaveStatus = document.querySelector("#review-save-status");
const sheetSaveSessionButton = document.querySelector("#sheet-save-session");
const sheetExportJsonButton = document.querySelector("#sheet-export-json");
const sheetBackReviewButton = document.querySelector("#sheet-back-review");
const sheetSidebar = document.querySelector(".sheet-sidebar");
const sheetSidebarMore = document.querySelector("#sheet-sidebar-more");
const characterSheetTitle = document.querySelector("#character-sheet-title");
const sheetSaveState = document.querySelector("#sheet-save-state");
const sheetPortraitImage = document.querySelector("#sheet-portrait-image");
const sheetPortraitEmpty = document.querySelector("#sheet-portrait-empty");
const sheetCharacterName = document.querySelector("#sheet-character-name");
const sheetPlayerName = document.querySelector("#sheet-player-name");
const sheetCampaignName = document.querySelector("#sheet-campaign-name");
const sheetMasterName = document.querySelector("#sheet-master-name");
const sheetSpeciesName = document.querySelector("#sheet-species-name");
const sheetLineageName = document.querySelector("#sheet-lineage-name");
const sheetClassName = document.querySelector("#sheet-class-name");
const sheetOriginTitle = document.querySelector("#sheet-origin-title");
const sheetOriginPlace = document.querySelector("#sheet-origin-place");
const sheetLevel = document.querySelector("#sheet-level");
const sheetExperience = document.querySelector("#sheet-experience");
const sheetEvolutionPoints = document.querySelector("#sheet-evolution-points");
const sheetGloryPoints = document.querySelector("#sheet-glory-points");
const sheetDefense = document.querySelector("#sheet-defense");
const sheetDamageReduction = document.querySelector("#sheet-damage-reduction");
const sheetInitiative = document.querySelector("#sheet-initiative");
const sheetMovement = document.querySelector("#sheet-movement");
const sheetLifeCard = document.querySelector(".sheet-resource-card--life");
const sheetLifeCurrent = document.querySelector("#sheet-life-current");
const sheetLifeMax = document.querySelector("#sheet-life-max");
const sheetLifeMinus = document.querySelector("#sheet-life-minus");
const sheetLifePlus = document.querySelector("#sheet-life-plus");
const sheetLifeBar = document.querySelector("#sheet-life-bar");
const sheetLifePercent = document.querySelector("#sheet-life-percent");
const sheetLifeStatus = document.querySelector("#sheet-life-status");
const sheetManaCard = document.querySelector(".sheet-resource-card--mana");
const sheetManaCurrent = document.querySelector("#sheet-mana-current");
const sheetManaMax = document.querySelector("#sheet-mana-max");
const sheetManaMinus = document.querySelector("#sheet-mana-minus");
const sheetManaPlus = document.querySelector("#sheet-mana-plus");
const sheetManaBar = document.querySelector("#sheet-mana-bar");
const sheetManaPercent = document.querySelector("#sheet-mana-percent");
const RECURSOS_DA_FICHA = [
  {
    atual: "vidaAtual",
    maximo: "vidaMaxima",
    input: sheetLifeCurrent,
    maxDisplay: sheetLifeMax,
    minusButton: sheetLifeMinus,
    plusButton: sheetLifePlus,
    bar: sheetLifeBar,
    percent: sheetLifePercent
  },
  {
    atual: "manaAtual",
    maximo: "manaMaxima",
    input: sheetManaCurrent,
    maxDisplay: sheetManaMax,
    minusButton: sheetManaMinus,
    plusButton: sheetManaPlus,
    bar: sheetManaBar,
    percent: sheetManaPercent
  }
];
const sheetAttributesList = document.querySelector("#sheet-attributes-list");
const snapshotsAnterioresDosAtributosDaFicha = new Map();
const sheetSkillsList = document.querySelector("#sheet-skills-list");
const sheetVulnerabilityTitle = document.querySelector("#sheet-vulnerability-title");
const sheetVulnerabilityDescription = document.querySelector("#sheet-vulnerability-description");
const sheetCombatWeapon = document.querySelector("#sheet-combat-weapon");
const sheetCombatWeaponDamage = document.querySelector("#sheet-combat-weapon-damage");
const sheetCombatWeaponRange = document.querySelector("#sheet-combat-weapon-range");
const sheetWeaponsList = document.querySelector("#sheet-weapons-list");
const sheetViews = document.querySelectorAll("[data-sheet-view]");
const sheetHistoryView = document.querySelector("#sheet-history-view");
const sheetHistoryViewHeading = document.querySelector("#sheet-history-view-heading");
const sheetEditHistory = document.querySelector("#sheet-edit-history");
const sheetAbilitiesSummary = document.querySelector("#sheet-abilities-summary");
const sheetOpenAbilities = document.querySelector("#sheet-open-abilities");
const sheetOpenInventory = document.querySelector("#sheet-open-inventory");
const sheetAbilitiesViewHeading = document.querySelector("#sheet-abilities-view-heading");
const sheetAbilitySearch = document.querySelector("#sheet-ability-search");
const sheetAbilityTypeFilter = document.querySelector("#sheet-ability-type-filter");
const sheetAbilityStateFilter = document.querySelector("#sheet-ability-state-filter");
const sheetImportAbility = document.querySelector("#sheet-import-ability");
const sheetAbilityFile = document.querySelector("#sheet-ability-file");
const sheetAbilityList = document.querySelector("#sheet-ability-list");
const sheetAbilityListCount = document.querySelector("#sheet-ability-list-count");
const sheetAbilityTypeTabs = document.querySelector("#sheet-ability-type-tabs");
const sheetAbilityDetails = document.querySelector("#sheet-ability-details");
const sheetAbilityStats = document.querySelector("#sheet-ability-stats");
const abilityImportDialog = document.querySelector("#ability-import-dialog");
const abilityImportTitle = document.querySelector("#ability-import-title");
const abilityImportPreview = document.querySelector("#ability-import-preview");
const abilityDuplicateWarning = document.querySelector("#ability-duplicate-warning");
const abilityIconOptions = document.querySelector("#ability-icon-options");
const abilityImportStatus = document.querySelector("#ability-import-status");
const abilityImportCancel = document.querySelector("#ability-import-cancel");
const abilityImportConfirm = document.querySelector("#ability-import-confirm");
const abilityRemoveDialog = document.querySelector("#ability-remove-dialog");
const abilityRemoveDescription = document.querySelector("#ability-remove-description");
const abilityRemoveCancel = document.querySelector("#ability-remove-cancel");
const abilityRemoveConfirm = document.querySelector("#ability-remove-confirm");
const sheetInventoryViewHeading = document.querySelector("#sheet-inventory-view-heading");
const sheetInventoryUsedCells = document.querySelector("#sheet-inventory-used-cells");
const sheetInventoryFreeCells = document.querySelector("#sheet-inventory-free-cells");
const sheetInventoryOccupancy = document.querySelector("#sheet-inventory-occupancy");
const sheetInventoryOccupancyBar = document.querySelector("#sheet-inventory-occupancy-bar");
const sheetInventorySummaryStatus = document.querySelector("#sheet-inventory-summary-status");
const sheetInventoryCapacity = document.querySelector("#sheet-inventory-capacity");
const sheetImportItem = document.querySelector("#sheet-import-item");
const sheetItemFile = document.querySelector("#sheet-item-file");
const sheetInventoryGridScroll = document.querySelector("#sheet-inventory-grid-scroll");
const sheetInventoryGrid = document.querySelector("#sheet-inventory-grid");
const sheetInventoryCellLayer = document.querySelector("#sheet-inventory-cell-layer");
const sheetInventoryPreviewLayer = document.querySelector("#sheet-inventory-preview-layer");
const sheetInventoryItemLayer = document.querySelector("#sheet-inventory-item-layer");
const sheetInventoryPlacementStatus = document.querySelector("#sheet-inventory-placement-status");
const sheetInventoryDetails = document.querySelector("#sheet-inventory-details");
const sheetInventoryDetailsEmpty = document.querySelector("#sheet-inventory-details-empty");
const sheetInventoryItemActions = document.querySelector("#sheet-inventory-item-actions");
const sheetInventoryReceived = document.querySelector("#sheet-inventory-received");
const sheetInventoryEquipmentSlots = document.querySelector("#sheet-inventory-equipment-slots");
const sheetEquipItem = document.querySelector("#sheet-equip-item");
const sheetEquipChoice = document.querySelector("#sheet-equip-choice");
const sheetStoreItem = document.querySelector("#sheet-store-item");
const sheetUnequipItem = document.querySelector("#sheet-unequip-item");
const sheetSwitchHandItem = document.querySelector("#sheet-switch-hand-item");
const sheetRotateItem = document.querySelector("#sheet-rotate-item");
const sheetInventoryWeight = document.querySelector("#sheet-inventory-weight");
const sheetInventoryWeightBar = document.querySelector("#sheet-inventory-weight-bar");
const sheetInventoryItemCount = document.querySelector("#sheet-inventory-item-count");
const sheetInventorySpaceSummary = document.querySelector("#sheet-inventory-space-summary");
const sheetInventoryGold = document.querySelector("#sheet-inventory-gold");
const sheetInventorySilver = document.querySelector("#sheet-inventory-silver");
const sheetMoveItem = document.querySelector("#sheet-move-item");
const sheetDiscardItem = document.querySelector("#sheet-discard-item");
const sheetInventoryPositionActions = document.querySelector("#sheet-inventory-position-actions");
const sheetPositionRotate = document.querySelector("#sheet-position-rotate");
const sheetPositionConfirm = document.querySelector("#sheet-position-confirm");
const sheetPositionCancel = document.querySelector("#sheet-position-cancel");
const sheetInventoryPendingActions = document.querySelector("#sheet-inventory-pending-actions");
const sheetInventoryPendingHeading = document.querySelector("#sheet-inventory-pending-heading");
const sheetInventoryPendingMessage = document.querySelector("#sheet-inventory-pending-message");
const sheetReorganizeForItem = document.querySelector("#sheet-reorganize-for-item");
const sheetRotatePendingItem = document.querySelector("#sheet-rotate-pending-item");
const sheetDiscardPendingItem = document.querySelector("#sheet-discard-pending-item");
const sheetCancelItemImport = document.querySelector("#sheet-cancel-item-import");
const inventoryDiscardDialog = document.querySelector("#inventory-discard-dialog");
const inventoryDiscardDescription = document.querySelector("#inventory-discard-description");
const inventoryDiscardCancel = document.querySelector("#inventory-discard-cancel");
const inventoryDiscardConfirm = document.querySelector("#inventory-discard-confirm");
const inventoryOccupiedDialog = document.querySelector("#inventory-occupied-dialog");
const inventoryOccupiedConfirm = document.querySelector("#inventory-occupied-confirm");
const inventoryRevealDialog = document.querySelector("#inventory-reveal-dialog");
const inventoryRevealArt = document.querySelector("#inventory-reveal-art");
const inventoryRevealTitle = document.querySelector("#inventory-reveal-title");
const inventoryRevealRarity = document.querySelector("#inventory-reveal-rarity");
const inventoryRevealAttribute = document.querySelector("#inventory-reveal-attribute");
const inventoryRevealMeta = document.querySelector("#inventory-reveal-meta");
const inventoryRevealEquip = document.querySelector("#inventory-reveal-equip");
const inventoryRevealConfirm = document.querySelector("#inventory-reveal-confirm");
const inventoryRevealEquipChoices = document.querySelector("#inventory-reveal-equip-choices");
const inventoryDragLayer = document.querySelector("#inventory-drag-layer");
const sheetSaveStatus = document.querySelector("#sheet-save-status");
const sheetFooterSaveState = document.querySelector("#sheet-footer-save-state");
const creationSteps = document.querySelectorAll(".creation-step");

const fields = [
  [characterNameInput, characterNameError],
  [playerNameInput, playerNameError],
  [campaignNameInput, campaignNameError],
  [gameMasterInput, gameMasterError]
];

const consultaPonteiroPreciso = window.matchMedia("(hover: hover) and (pointer: fine)");
const etapasDaCriacao = [identityStep, speciesStep, classStep, originStep, attributesStep, reviewStep];
let temporizadorDaTransicaoDeEtapa = null;
let transicaoDaArteDaEspecie = 0;
