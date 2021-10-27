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
const colors = ['#d4eac7', '#c6e3b5', '#b7dda2', '#a9d68f', '#9bcf7d', '#8cc86a', '#7ec157', '#77be4e', '#70ba45', '#65a83e', '#599537', '#4e8230', '#437029',     '#385d22', '#2d4a1c', '#223815'], 
    legendCellSize = 20
;

const parameters = ["area", "coeff_emprise_sol", "coeff_occu_sol", "aire_vegetalisee_pourc", "pourc_aire_route", "n_parcelles", "ecole", "collegelycee", "som_refroid_arbres", "som_impermeabilite", "aire_moyenne_ilots", "avg_hauteur", "avg_width", "avg_height", "prop_bati_tertiaire", "prop_perio_constr_generale_better", "prop_perio_constr_avant_1919", "prop_perio_constr_1971_1990", "prop_perio_constr_1946_1970", "rp_cccoll_sur_resprin", "rp_garl_sur_menages", "rp_voit1p_sur_menages", "rp_voit1p_sur_menages", "population", "prop_bati_residentiel", "prop_bati_industriel"]

var data = ["Option 1", "Option 2", "Option 3"];

function getColorIndex(color) {
    for (var i = 0; i < colors.length; i++) {
        if (colors[i] === color) {
            return i;
        }
    }
    return -1;
}

function addTooltip() {
    var tooltip = svg.append("g") // Group for the whole tooltip
        .attr("id", "tooltip")
        .style("display", "none");
    
    tooltip.append("polyline") // The rectangle containing the text, it is 210px width and 60 height
        .attr("points","0,0 210,0 210,60 0,60 0,0")
        .style("fill", "#222b1d")
        .style("stroke","black")
        .style("opacity","0.9")
        .style("stroke-width","1")
        .style("padding", "1em");
    
    tooltip.append("line") // A line inserted between country name and score
        .attr("x1", 40)
        .attr("y1", 25)
        .attr("x2", 160)
        .attr("y2", 25)
        .style("stroke","#929292")
        .style("stroke-width","0.5")
        .attr("transform", "translate(0, 5)");
    
    var text = tooltip.append("text") // Text that will contain all tspan (used for multilines)
        .style("font-size", "13px")
        .style("fill", "#c1d3b8")
        .attr("transform", "translate(0, 20)");
    
    text.append("tspan") // Country name udpated by its id
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 0)
        .attr("id", "tooltip-country")
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .style("font-size", "16px");
    
    text.append("tspan") // Fixed text
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "929292")
        .text("Surface : ");
    
    text.append("tspan") // Score udpated by its id
        .attr("id", "tooltip-score")
        .style("fill","#c1d3b8")
        .style("font-weight", "bold");
    
    
    return tooltip;
}

Promise.all(promises).then(function(values) {
    const geojson = values[0]; // Récupération de la première promesse : le contenu du fichier JSON
    const csv = values[1]; // Récupération de la deuxième promesse : le contenu du fichier csv

    console.log(csv)
    console.log(geojson)
    
    var tooltip = addTooltip();

    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('class', 'iris')
        .attr('id', d => "iris_" + d.properties.codeiris)
        .attr("d", path);

    function updateParametersScaling(param){
        const min = d3.min(csv, d =>  +d[param]),
        max = d3.max(csv, d =>  +d[param]);
        
        let legendNbCells = 20;

        let quantile = d3.scaleSequential().domain([min, max])
            .interpolator(d3.interpolatePuRd);
        // let quantile = d3.scaleQuantile().domain([min, max])
        //     .range(colors);

        svg.selectAll(".legendelements").remove()
        let legend = svg.append('g')
            .attr('transform', 'translate(625, 150)')
            .attr('id', 'legend')
            .attr('class', 'legendelements');

        let legendStep = (max-min)/legendNbCells
        legend.selectAll('.colorbar')
            .data(d3.range(min, max, legendStep))
            .enter().append('svg:rect')
                .attr('y', d => (d-min)/legendStep * legendCellSize + 'px')
                .attr('height', '20px')
                .attr('width', '20px')
                .attr('x', '0px')
                // .attr("class", d => "q" + d + "-9")
                .style("fill", d => quantile(d))
                .style("stroke-width", "0.25px")
                .style("stroke", "rgb(0,0,0)")
        ;

        let legendScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, legendNbCells * legendCellSize]);

        legendAxis = svg.append("g")
            .attr('class', 'legendelements')
            .attr('transform', 'translate('+(legendCellSize+625)+', 150)')
            .call(d3.axisRight(legendScale));

        csv.forEach(function(e,i) {
            d3.select("#iris_" + e.codeiris)
                .style("fill", quantile(e[param]))
                // .attr("class", d => "iris_q" + quantile(e.area) + "-9")
                .on("mouseover", function(d) {
                    tooltip.style("display", null);
                    tooltip.select('#tooltip-country')
                        .text(e.codeiris);
                    tooltip.select('#tooltip-score')
                        .text(e[param]);
                    legend.select("#cursor")
                        .attr('transform', 'translate(' + (legendCellSize + 5) + ', ' + (getColorIndex(quantile(+e[param])) * legendCellSize) + ')')
                        .style("display", null);
                })
                .on("mouseout", function(d) {
                    tooltip.style("display", "none");
                    legend.select("#cursor").style("display", "none");
                })
                .on("mousemove", function(d) {
                    var mouse = d3.pointer(d);
                    tooltip.attr("transform", "translate(" + mouse[0] + "," + (mouse[1] - 75) + ")");
                });
        });
    }
    updateParametersScaling("area")
    let selecttest = d3.select('p')
        .append('select')
        .attr('class','select')
        .on('change', onchangefunc)

    function onchangefunc(d) {
        let selectValue = d3.select('select').property('value')
        updateParametersScaling(selectValue)
        d3.select('body')
            .append('p')
            .text(selectValue + ' is the last selected option.')
    };

    let optionstest = selecttest
        .selectAll('option')
        .data(parameters).enter()
        .append('option')
        .text(function (d) { return d; })
        // .values(function (d) { return d; })
    ;
});



