// https://www.datavis.fr/index.php?page=map-population
const width = 750, height = 750;
const path = d3.geoPath();
console.log("coucou")
const projection = d3.geoConicConformal()
.center([4.8312, 45.75])
.scale(78000)
.translate([width / 2, height / 2]);

path.projection(projection);

const svg = d3.select('#map').append("svg")
.attr("id", "svg")
.attr("width", width)
.attr("height", height);

const deps = svg.append("g");

let div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var promises = [];

promises.push(d3.json('maps/iris_lyon.geojson'));
promises.push(d3.tsv('csv/lyon.csv', 
                    function(d) { return {
                        codeiris: d.code_iris,
                        area: +d.area,
                        coeff_emprise_sol: +d.coeff_emprise_sol,
                        coeff_occu_sol: +d.coeff_occu_sol,
                        aire_vegetalisee_pourc: +d.aire_vegetalisee_pourc,
                        pourc_aire_route: +d.pourc_aire_route,
                        n_parcelles: +d.n_parcelles,
                        ecole: +d.ecole,
                        collegelycee: +d.collegelycee,
                        som_refroid_arbres: +d.som_refroid_arbres,
                        som_impermeabilite: +d.som_impermeabilite,
                        aire_moyenne_ilots: +d.aire_moyenne_ilots,
                        avg_hauteur: +d.avg_hauteur,
                        avg_width: +d.avg_width,
                        avg_height: +d.avg_height,
                        prop_bati_tertiaire: +d.prop_bati_tertiaire,
                        prop_perio_constr_generale_better: +d.prop_perio_constr_generale_better,
                        prop_perio_constr_avant_1919: +d.prop_perio_constr_avant_1919,
                        prop_perio_constr_1971_1990: +d.prop_perio_constr_1971_1990,
                        prop_perio_constr_1946_1970: +d.prop_perio_constr_1946_1970,
                        rp_cccoll_sur_resprin: +d.rp_cccoll_sur_resprin,
                        rp_garl_sur_menages: +d.rp_garl_sur_menages,
                        rp_voit1p_sur_menages: +d.rp_voit1p_sur_menages,
                        rp_voit1p_sur_menages: +d.rp_voit1p_sur_menages,
                        population: +d.population,
                        prop_bati_residentiel: +d.prop_bati_residentiel,
                        prop_bati_industriel: +d.prop_bati_industriel,
                    }; })
                    );
const legendCellSize = 20, legendNbCells = 15;
const legendPositionWidth = width*0.85, legendPositionHeight = (height-legendNbCells*legendCellSize)/2;

const parameters = ["area", "coeff_emprise_sol", "coeff_occu_sol", "aire_vegetalisee_pourc", "pourc_aire_route", "n_parcelles", "ecole", "collegelycee", "som_refroid_arbres", "som_impermeabilite", "aire_moyenne_ilots", "avg_hauteur", "avg_width", "avg_height", "prop_bati_tertiaire", "prop_perio_constr_generale_better", "prop_perio_constr_avant_1919", "prop_perio_constr_1971_1990", "prop_perio_constr_1946_1970", "rp_cccoll_sur_resprin", "rp_garl_sur_menages", "rp_voit1p_sur_menages", "rp_voit1p_sur_menages", "population", "prop_bati_residentiel", "prop_bati_industriel"]

const parametersProperties = {
    "area": {"name": "Aire (km$^2$)", "factor": 1/1000/1000},
    "coeff_emprise_sol": {"name": "Coefficient d'emprise au sol des bâtiments (CES)"},
    "coeff_occu_sol": {"name": "Coefficient d'occupation des sols (COS)"},
    "aire_vegetalisee_pourc": {"name": "Pourcentage d'aire végétalisée par rapport à l'aire de la zone", "factor": 100, "cmap": "Greens"},
    "pourc_aire_route": {"name": "Proportion d'aire de route par rapport à la surface de la zone"},
    "n_parcelles": {"name": "Nombre de parcelles"},
    "ecole": {"name": "Ecoles du secondaire"},
    "collegelycee": {"name": "Collèges et lycées"},
    "som_refroid_arbres": {"name": "Pouvoir refroidissant des arbres"},
    "som_impermeabilite": {"name": "Imperméabilité (%)"},
    "aire_moyenne_ilots": {"name": "Aire moyenne des îlots (m²)"},
    "avg_hauteur": {"name": "Hauteur moyenne des bâtiments"},
    "avg_width": {"name": "Largeur moyenne des bâtiments"},
    "avg_height": {"name": "Longueur moyenne des bâtiments"},
    "prop_bati_tertiaire": {"name": "Proportion de bâtiments dédié au secteur tertiaire"},
    "prop_perio_constr_generale_better": {"name": "Estimation de l'année moyenne de construction"},
    "prop_perio_constr_avant_1919": {"name": "Proportion de bâtiments construits avant 1919"},
    "prop_perio_constr_1971_1990": {"name": "Proportion de bâtiments construits entre 1971 et 1990"},
    "prop_perio_constr_1946_1970": {"name": "Proportion de bâtiments construits entre 1946 et 1970"},
    "rp_cccoll_sur_resprin": {"name": "% de chauffage central collectif parmi les résidences principales"},
    "rp_garl_sur_menages": {"name": "% de menages disposant d'un emplacement de stationnement"},
    "rp_voit1p_sur_menages": {"name": "% de menages ayant une voiture ou plus"},
    "rp_voit1p_sur_menages": {"name": "% de menages ayant une voiture ou plus"},
    "population": {"name": "Population"},
    "prop_bati_residentiel": {"name": "Proportion de bâtiments dédié au secteur residentiel"},
    "prop_bati_industriel": {"name": "Proportion de bâtiments dédié au secteur industriel"}
}

const authorizedColorMaps = ["Blues", "BrBG", "BuGn", "BuPu", "Cividis", "Cool", "CubehelixDefault", "GnBu", "Greens", "Greys", "Inferno", "Magma", "OrRd", "Oranges", "PRGn", "PiYG", "Plasma", "PuBu", "PuBuGn", "PuOr", "PuRd", "Purples", "Rainbow", "RdBu", "RdGy", "RdPu", "RdYlBu", "RdYlGn", "Reds",  "Sinebow", "Spectral",  "Turbo", "Viridis", "Warm", "YlGn", "YlGnBu", "YlOrBr", "YlOrRd"]

var data = ["Option 1", "Option 2", "Option 3"];

function getLocationColor(value, min, max) {
    return legendNbCells*(value-min)/(max-min);
}

function addTooltip(param) {
    let paramName = parametersProperties[param].name;
    let tooltipWidth = paramName.length * 8, tooltipHeight = 60;
    tooltipWidth = (tooltipWidth< 300) ? 300 : tooltipWidth;
    var tooltip = svg.append("g") // Group for the whole tooltip
        .attr("id", "tooltip")
        .attr("class", "legendelements")
        .style("display", "none");
    
    tooltip.append("polyline") // The rectangle containing the text, it is 210px width and 60 height
        .attr("points","0,0 " + tooltipWidth + ",0 " + tooltipWidth + "," + tooltipHeight + " 0," + tooltipHeight + " 0,0")
        .style("fill", "#02011b")
        .style("stroke","black")
        .style("opacity","0.9")
        .style("stroke-width","1")
        .style("padding", "1em");
    
    tooltip.append("line") // A line inserted between country name and score
        .attr("x1", 50)
        .attr("y1", 25)
        .attr("x2", tooltipWidth-50)
        .attr("y2", 25)
        .style("stroke","#929292")
        .style("stroke-width","0.5")
        .attr("transform", "translate(0, 5)");
    
    var text = tooltip.append("text") // Text that will contain all tspan (used for multilines)
        .style("font-size", "13px")
        .style("fill", "#cbceda")
        .attr("transform", "translate(0, 20)");
    
    text.append("tspan") // Country name udpated by its id
        .attr("x", tooltipWidth/2) // ie, tooltip width / 2
        .attr("y", 0)
        .attr("id", "tooltip-country")
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .style("font-size", "16px");
    
    text.append("tspan") // Fixed text
        .attr("x", tooltipWidth/2) // ie, tooltip width / 2
        .attr("y", tooltipHeight/2)
        .attr("text-anchor", "middle")
        .style("fill", "929292")
        .text(paramName + " : ");
    
    text.append("tspan") // Score udpated by its id
        .attr("id", "tooltipdata")
        .style("fill","#cbceda")
        .style("font-weight", "bold");
    
    
    return tooltip;
}

Promise.all(promises).then(function(values) {
    const geojson = values[0]; // Récupération de la première promesse : le contenu du fichier JSON
    const csv = values[1]; // Récupération de la deuxième promesse : le contenu du fichier csv

    console.log(csv)
    console.log(geojson)

    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('class', 'iris')
        .attr('id', d => "iris_" + d.properties.codeiris)
        .attr("d", path);

    function updateParametersScaling(param, _colormap=false){
        let paramProperties = parametersProperties[param];
        let factor = (paramProperties.factor) ? paramProperties.factor : 1;
        const min = d3.min(csv, d =>  +d[param]*factor),
        max = d3.max(csv, d =>  +d[param]*factor);
        
        let colormap = "";
        if(!_colormap){
            colormap = d3.interpolateViridis;
        } else {
            colormap = d3["interpolate"+_colormap] ? d3["interpolate"+_colormap] : d3.interpolateViridis;
        }
        let quantile = d3.scaleSequential().domain([min, max])
            .interpolator(colormap);
        
        svg.selectAll(".legendelements").remove()
        let tooltip = addTooltip(param);
        
        let legend = svg.append('g')
        .attr('transform', 'translate('+legendPositionWidth+', '+legendPositionHeight+')')
        .attr('id', 'legend')
        .attr('class', 'legendelements');

        let cursor = legend.append('polyline')
            // .attr('transform', 'translate('+legendPositionWidth+', '+legendPositionHeight+')')
            .attr("points", "0," + -legendCellSize/2 + " 0," + legendCellSize/2 + " " + (legendCellSize * 0.8) + ",0" )
            .attr("id", "cursor")
            .attr('class', 'legendelements')
            .style("display", "none")
            .style('fill', "rgb(150, 150, 150)");

        let legendStep = (max-min)/legendNbCells
        legend.selectAll('.colorbar')
            .data(d3.range(min, max, legendStep))
            .enter().append('svg:rect')
                .attr('y', d => (d-min)/legendStep * legendCellSize + 'px')
                .attr('height', '20px')
                .attr('width', '20px')
                .attr('x', '0px')
                // .attr("class", d => "q" + d + "-9")
                .attr("id", d => "legendCell"+(d-min)/legendStep)
                .style("fill", d => quantile(d))
                .style("stroke-width", "0.25px")
                .style("stroke", "rgb(0,0,0)")
            .on("mouseover", function(d) {
                // let n = d.target.id.slice("legendCell".length)
                // legend.select("#cursor")
                //     .attr('transform','translate(' + (-legendCellSize-5) + ', ' + (n*legendCellSize+legendCellSize*0.5) + ')')
                //     .style("display", null);
                // d3.selectAll("path[customcolor='" + d.target.style.fill + "']")
                //     .style('fill', "#9966cc");
            })
            .on("mouseout", function(d) {
                // legend.select("#cursor")
                //     .style("display", "none");
                // d3.selectAll("path[customcolor='" + d.target.style.fill + "']")
                //     .style('fill', d.target.style.fill);
            })
        ;

        let legendScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, legendNbCells * legendCellSize]);

        legendAxis = svg.append("g")
            .attr('class', 'legendelements')
            .attr('transform', 'translate('+(legendCellSize+legendPositionWidth)+', '+legendPositionHeight+')')
            .call(d3.axisRight(legendScale));

        csv.forEach(function(e,i) {
            d3.select("#iris_" + e.codeiris)
                .style("fill", quantile(e[param]*factor))
                .attr("customcolor", quantile(e[param]*factor))
                // .attr("class", d => "iris_q" + quantile(e.area) + "-9")
                .on("mouseover", function(d) {
                    tooltip.style("display", null);
                    tooltip.select('#tooltip-country')
                        .text(e.codeiris);
                    tooltip.select('#tooltipdata')
                        .text((e[param]*factor).toLocaleString(
                            "fr-FR", // leave undefined to use the visitor's browser 
                                       // locale or a string like 'en-US' to override it.
                            { minimumFractionDigits: 2 }
                          ));
                    legend.select("#cursor")
                        .attr('transform', 'translate(' + (-legendCellSize-5) + ', ' + (getLocationColor(e[param]*factor, min, max) * legendCellSize) + ')')
                        .style("display", null);
                })
                .on("mouseout", function(d) {
                    tooltip.style("display", "none");
                    legend.select("#cursor").style("display", "none");
                })
                .on("mousemove", function(d) {
                    var mouse = d3.pointer(d);
                    // tooltip.attr("transform", "translate(" + mouse[0] + "," + (mouse[1] - 75) + ")");
                });
        });
    }
    updateParametersScaling("area")
    let select = d3.select('p')
        .append('select')
        .attr('class','select')
        .attr('id','paramSelection')
        .on('change', onChangeParameter)

    function onChangeParameter() {
        let param = d3.select('#paramSelection').property('value')
        let paramProperties = parametersProperties[param];

        let colormap = ""
        if(paramProperties.cmap){
            d3.select('#colormapselection').property('value', paramProperties.cmap)
            colormap = paramProperties.cmap
        }else{
            colormap = d3.select('#colormapselection').property('value')            
        }
        updateParametersScaling(param, colormap)
    }

    function onChangeColorMap() {
        let param = d3.select('#paramSelection').property('value')
        let colorMapValue = d3.select('#colormapselection').property('value')
        updateParametersScaling(param, colorMapValue)
    }

    let options = select
        .selectAll('option')
        .data(parameters).enter()
        .append('option')
        .text(function (d) { return d; })
        // .values(function (d) { return d; })
    ;

        
    let colormaps = d3.select("p").append("select")
        .attr("id", "colormapselection")
        .on('change', onChangeColorMap)
    let optionsColorMaps = colormaps
        .selectAll('option')
        .data(authorizedColorMaps).enter()
        .append('option')    
        .text(function (d) { return d; })

});



