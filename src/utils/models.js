export class PropertyStats {
    name;
    logo;
    background;
    activeLabel;
    activeProperties;
    activePrice;
    underContractLabel;
    underContractProperties;
    underContractPrice;
    closedLabel;
    closedProperties;
    closedPrice;
    annotation;
    isMtStatsPage;
    statsKeys;
    
    constructor({data, name, logo, background, annotation, isMtStatsPage}) {
        this.name = name || '';
        this.logo = logo || '';
        this.background = background || '';
        this.activeLabel = 'Available';
        this.activeProperties = data && data.ACTIVE_PROPERTIES ? parseInt(data.ACTIVE_PROPERTIES) : '';
        this.activePrice = data && data.ACTIVE_PRICE ? parseInt(data.ACTIVE_PRICE) : '';
        this.underContractLabel = 'Under Contract';
        this.underContractProperties = data && data.UC_PROPERTIES ? parseInt(data.UC_PROPERTIES) : '';
        this.underContractPrice = data && data.UC_PRICE ? parseInt(data.UC_PRICE) : '';
        this.closedLabel = 'Sold';
        this.closedProperties = data && data.CLOSED_PROPERTIES ? parseInt(data.CLOSED_PROPERTIES) : '';
        this.closedPrice = data && data.CLOSED_PRICE ? parseInt(data.CLOSED_PRICE) : '';
        this.annotation = annotation || '';
        this.isMtStatsPage = isMtStatsPage || false;
        this.statsKeys = !isMtStatsPage && !this.underContractProperties ? ['closed', 'active'] : ['active', 'closed', 'underContract'];
    }
}